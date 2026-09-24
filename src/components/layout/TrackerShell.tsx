import { OrnamentBackdrop } from "./OrnamentBackdrop";
import { TrackerMobileBottomNav } from "./TrackerMobileBottomNav";
import { TrackerSideNav } from "./TrackerSideNav";
import { TrackerTopNav } from "./TrackerTopNav";

interface TrackerShellProps {
  children: React.ReactNode;
  /** Screen-owned list for the sidebar; omit for a shell with no sidebar. */
  sidebar?: React.ReactNode;
}

export function TrackerShell({ children, sidebar }: TrackerShellProps) {
  return (
    <main className="relative min-h-screen w-full overflow-x-clip text-foreground [--collection-primary:#f2ca50] [--collection-primary-ink:#382b00] [--collection-ink:#fffaf0] [--collection-ink-muted:#d5c8a7] [--collection-ink-soft:#9e927a]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(12,14,17,0.95),rgba(12,14,17,1)),url('https://lh3.googleusercontent.com/aida/AP1WRLuJZHYj_Zq3jePmq3_uHnibnH8tY5fhtaq2asR5wXTZySJ7r33vqdYpzAgTjZht4sk1ZvNosXRtmwLgzpmdxhmjmgNLqlNYoxYAzvMVWU2TyJmLI3N6LgrdliCYerZhlZVvtpIWq0-jnhiCkGRQBnOdppEZUSJJGc7PlBqz21T1uWrxBuTiYB_Cm1XK2FZis9MqoX1NQ-ob3P0XZ6iRX-PrRpdfUyEysKnBu57xaN1t9GMw9TnL5ooaB5s')] bg-cover bg-center bg-fixed" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,transparent_26%,rgba(0,0,0,0.97)_100%)]" />
      <OrnamentBackdrop />

      <TrackerTopNav />
      <TrackerSideNav>{sidebar}</TrackerSideNav>

      {/* the top bar is md+ only and the bottom bar is mobile only, so the shell's
          own insets follow the same split: a small top gap on mobile (nothing is
          fixed up there) and room for the bottom bar's 4.7rem + the home indicator */}
      <div
        className={`relative z-10 h-full overflow-y-auto px-4 pb-28 pt-5 md:pb-8 md:pt-24 ${sidebar ? "md:ml-60" : ""}`}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-10 lg:px-16">
          {children}
        </div>
      </div>

      <TrackerMobileBottomNav />
    </main>
  );
}
