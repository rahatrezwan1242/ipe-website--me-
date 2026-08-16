import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Figtree,
  JetBrains_Mono,
} from "next/font/google";

// Homepage-only fonts (per home-page-design.md) — applied as CSS variables on
// the page wrapper in app/page.tsx. Other pages keep Inter/Geist Mono.
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const HOME_FONT_VARS = `${cormorant.variable} ${dmSerif.variable} ${figtree.variable} ${jetbrainsMono.variable}`;
