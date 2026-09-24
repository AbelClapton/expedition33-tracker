#!/usr/bin/env node
/**
 * Publishes the tracker to GitHub Pages at https://<user>.github.io/expedition33-tracker/.
 *
 *   pnpm build:pages     export only, into `out/` (add `--serve` to preview it at the real URL shape)
 *   pnpm publish:pages    build, then force-push `out/` to the `gh-pages` branch
 *
 * Pages is served straight from the branch, not from Actions: the gh token here has no
 * `workflow` scope, so pushing a `.github/workflows/` file is rejected.
 *
 * Two things need fixing up around the export, both because Pages is plain static hosting:
 *   - `src/app/api/tile` is a dynamic route handler, and `output: "export"` refuses those.
 *     It only exists to cache tiles for local dev, so it steps aside for the build. Next
 *     ignores route folders whose name starts with `_`, which is what makes this a rename.
 *   - `public/tiles` is that proxy's cache of wiki artwork (thousands of files, tens of MB).
 *     The deployed build hotlinks the artwork instead of reading it, and this repo
 *     deliberately does not redistribute it, so it is dropped from the export.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const WORK = path.join(ROOT, ".pages-work");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
/** Must match `basePath` in next.config.ts. */
const REPO = "expedition33-tracker";

const BUILD_ONLY = process.argv.includes("--build-only");
const SERVE = process.argv.includes("--serve");

/** Dev-only route handler: parked under `_api` so the exporter never sees it. */
const API_DIR = path.join(ROOT, "src", "app", "api");
const API_PARKED = path.join(ROOT, "src", "app", "_api");

/** public/ subfolders the exported build must not carry (see the header note). */
const DROPPED_FROM_EXPORT = ["tiles", "regions"];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with ${result.status}`);
  }
}

function capture(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  // `next dev` leaves route types for the parked tile handler under `.next/dev/types`, and
  // type-checking the export then fails on a module the build cannot see. Only those types
  // go, never `.next/cache`: that is where the downloaded `next/font` files live, and the
  // build has to reach out to Google again if it is missing.
  for (const stale of [".next/dev/types", ".next/types"]) {
    fs.rmSync(path.join(ROOT, stale), { recursive: true, force: true });
  }

  fs.renameSync(API_DIR, API_PARKED);
  try {
    run(process.execPath, [NEXT_BIN, "build"], {
      env: { ...process.env, STATIC_EXPORT: "1" },
    });
  } finally {
    fs.renameSync(API_PARKED, API_DIR);
  }

  for (const dir of DROPPED_FROM_EXPORT) {
    fs.rmSync(path.join(OUT, dir), { recursive: true, force: true });
  }
  // Pages runs Jekyll unless told otherwise, and Jekyll skips folders starting with `_` -
  // which is every chunk under `_next/`.
  fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
}

function publish() {
  const remote = capture("git", ["remote", "get-url", "origin"]);
  if (!remote) throw new Error("No `origin` remote: create the GitHub repo and set it first.");

  const name = capture("git", ["config", "user.name"]) || "github-actions";
  const email = capture("git", ["config", "user.email"]) || "github-actions@github.com";

  fs.rmSync(WORK, { recursive: true, force: true });
  fs.cpSync(OUT, WORK, { recursive: true });

  const stamp = new Date().toISOString();
  const commit = ["-c", `user.name=${name}`, "-c", `user.email=${email}`];
  run("git", ["init", "-q", "-b", "gh-pages"], { cwd: WORK });
  run("git", ["add", "-A"], { cwd: WORK });
  run("git", [...commit, "commit", "-q", "-m", `Deploy ${stamp}`], { cwd: WORK });
  run("git", ["push", "-f", remote, "gh-pages"], { cwd: WORK });

  fs.rmSync(WORK, { recursive: true, force: true });
  console.log(`\npublished to ${remote.replace(/\.git$/, "")} (gh-pages)`);
}

/** Serves the export under the deploy subpath, so what you open is what Pages serves. */
function serve() {
  const prefix = `/${REPO}`;
  const types = {
    ".css": "text/css",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
    ".woff2": "font/woff2",
  };

  http
    .createServer((req, res) => {
      const url = new URL(req.url, "http://localhost");
      if (!url.pathname.startsWith(prefix)) {
        res.writeHead(302, { location: `${prefix}/` }).end();
        return;
      }
      let file = path.join(OUT, decodeURIComponent(url.pathname.slice(prefix.length)));
      if (!path.resolve(file).startsWith(OUT)) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) file = path.join(OUT, "404.html");

      res.writeHead(fs.existsSync(file) ? 200 : 404, {
        "content-type": types[path.extname(file)] ?? "application/octet-stream",
      });
      fs.createReadStream(file).pipe(res);
    })
    .listen(4300, () => console.log(`\npreview: http://localhost:4300${prefix}/`));
}

build();
console.log(`\nexport built: ${OUT}`);
if (SERVE) serve();
else if (!BUILD_ONLY) publish();
