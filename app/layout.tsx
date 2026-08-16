import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { ParticleBackground } from "@/components/particle-background";
import { CustomCursor } from "@/components/custom-cursor";
import { ClickSpill } from "@/components/click-spill";
import { ChatPanel } from "@/components/chat-panel";
import { DepartmentAssistant } from "@/components/department-assistant";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";

// Runs before first paint (see node_modules/next/dist/docs/.../preventing-flash-before-hydration.md)
// so a stored "light" preference never flashes dark first. <html> already ships
// with the "dark" class server-rendered, so this only ever needs to remove it.
const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("ipe-theme:v1")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}})()`;

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const TITLE = "IPE · IUT — Industrial & Production Engineering";
const DESCRIPTION = "The digital home of Industrial & Production Engineering at Islamic University of Technology — curriculum, GPA/CGPA calculator, and an AI academic advisor for Batch 34.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · IPE IUT",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "IPE · IUT",
    images: [{ url: "/iut-logo.png", width: 768, height: 768 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/iut-logo.png"],
  },
  icons: {
    icon: [
      { url: "/iut-favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/iut-favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/iut-favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/iut-favicon-180.png",
    shortcut: "/iut-favicon-32.png"
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080b14" },
  ],
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning className={`dark scroll-smooth ${inter.variable} ${mono.variable} h-full antialiased`}>
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    </head>
    <body className="min-h-full flex flex-col bg-background text-foreground">
      <ThemeProvider>
        <div className="print:hidden"><ParticleBackground /><SiteNav /></div>
        {children}
        <div className="print:hidden"><ChatPanel /><DepartmentAssistant /><ClickSpill /><CustomCursor /></div>
      </ThemeProvider>
    </body>
  </html>;
}
