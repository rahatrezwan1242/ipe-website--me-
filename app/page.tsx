import { HOME_FONT_VARS } from "@/lib/home-fonts";
import { HOME } from "@/lib/home-palette";
import { HomeShell } from "@/components/home/home-shell";
import { HomeNavbar } from "@/components/home/home-navbar";
import { Hero } from "@/components/home/hero";
import { Memories } from "@/components/home/memories";
import { Timeline } from "@/components/home/timeline";
import { Representatives } from "@/components/home/representatives";
import { HomeFooter } from "@/components/home/home-footer";

export default function HomePage() {
  return (
    <main className={`${HOME_FONT_VARS} antialiased`} style={{ background: HOME.bgBase }}>
      <HomeShell>
        <HomeNavbar />
        <div className="snap-y snap-mandatory">
          <Hero />
          <Memories />
        </div>
        <Timeline />
        <Representatives />
        <HomeFooter />
      </HomeShell>
    </main>
  );
}
