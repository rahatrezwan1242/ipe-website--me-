"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "ipe-theme:v1";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

// Next.js App Router still executes "use client" component bodies on the
// server to produce the initial HTML, and React warns if useLayoutEffect is
// called in that pass ("does nothing on the server"). The callback never
// actually runs server-side either way, so falling back to useEffect there
// is a no-op change in behavior — it just avoids the console warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Re-applies the persisted theme before paint. This covers the first
  // client render (agreeing with whatever the inline script in the <head>
  // already set on <html>, so there's no state/DOM mismatch) and also
  // React Strict Mode's dev-only remount, which resets <html> to just what
  // JSX declares and would otherwise silently drop a "light" preference
  // back to the hardcoded "dark" default — see the Next.js flash-prevention
  // guide's "Re-applying attributes in development" section.
  useIsomorphicLayoutEffect(() => {
    const stored = readStoredTheme();
    applyTheme(stored);
    setTheme(stored);
  }, []);

  const toggle = useCallback(() => {
    // Briefly enables a CSS transition (see .theme-transitioning in globals.css)
    // so the color swap crossfades instead of snapping instantly.
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    window.setTimeout(() => root.classList.remove("theme-transitioning"), 400);

    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage full / disabled
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
