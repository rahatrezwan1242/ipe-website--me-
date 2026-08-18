import { Cormorant_Garamond, DM_Serif_Display, Figtree, JetBrains_Mono } from "next/font/google";

// Homepage-only fonts (per home-page-design.md) — applied as CSS variables on
// the page wrapper in app/page.tsx. Other pages keep Inter/Geist Mono.
export const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600", "700"] });
export const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], weight: ["400"] });
export const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
export const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const HOME_FONT_VARS = `${cormorant.variable} ${dmSerif.variable} ${figtree.variable} ${jetbrainsMono.variable}`;

// Homepage-only palette (per home-page-design.md). Scoped to app/page.tsx and
// components/home/* — do not use elsewhere, other pages keep their own theme.
// Values are "Palette 2" (the dusk mountain-lake photo) — key names are
// historical from an earlier teal/brass palette and no longer describe the
// hues themselves; accentTeal is now the palette's blue swatch, accentWarm
// is its dusty rose.
//
// These resolve through CSS custom properties (defined per-theme in
// app/globals.css :root / .dark) rather than hardcoded hex, so the homepage
// follows the sitewide light/dark toggle. Consumers can still concatenate a
// hex-alpha suffix onto a *literal* color, but not onto a var() reference —
// use `color-mix(in oklab, HOME.x N%, transparent)` for a translucent variant.
export const HOME = {
  bgBase: "var(--home-bg-base)", bgSurface: "var(--home-bg-surface)", bgCard: "var(--home-bg-card)", border: "var(--home-border)",
  accentTeal: "var(--home-accent-teal)", accentWarm: "var(--home-accent-warm)", accentPurple: "var(--home-accent-purple)",
  accentWarmText: "var(--home-accent-warm-text)", accentPurpleText: "var(--home-accent-purple-text)",
  textPrimary: "var(--home-text-primary)", textSecondary: "var(--home-text-secondary)", textMuted: "var(--home-text-muted)",
} as const;
