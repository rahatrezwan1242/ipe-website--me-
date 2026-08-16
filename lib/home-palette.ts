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
  bgBase: "var(--home-bg-base)",
  bgSurface: "var(--home-bg-surface)",
  bgCard: "var(--home-bg-card)",
  border: "var(--home-border)",
  accentTeal: "var(--home-accent-teal)",
  accentWarm: "var(--home-accent-warm)",
  accentPurple: "var(--home-accent-purple)",
  accentWarmText: "var(--home-accent-warm-text)",
  accentPurpleText: "var(--home-accent-purple-text)",
  textPrimary: "var(--home-text-primary)",
  textSecondary: "var(--home-text-secondary)",
  textMuted: "var(--home-text-muted)",
} as const;
