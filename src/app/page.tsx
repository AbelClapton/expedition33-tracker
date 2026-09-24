import Link from "next/link";
import { BASE_PATH } from "@/lib/assetPath";

/**
 * The tracker has no landing screen: the Library is the home route.
 *
 * `redirect()` from `next/navigation` needs a server, and the GitHub Pages build is plain
 * files, so the hop is written into the HTML instead - a meta refresh, with a real link
 * behind it for anything that ignores the hint.
 */
export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/collections/`} />
      <p className="p-8 text-center text-sm">
        Opening the <Link href="/collections">Picto Library</Link>...
      </p>
    </>
  );
}
