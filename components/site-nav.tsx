 "use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_CHAT_EVENT } from "@/components/chat-panel";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
 {label:"Home",href:"/"},
 {label:"Curriculum",href:"/curriculum"},
 {label:"GPA Studio",href:"/calculator"},
 {label:"Resources",href:"/resources"},
 {label:"About IPE",href:"/about"},
];

export function SiteNav() {
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 // The homepage ships its own nav (components/home/home-navbar.tsx) per home-page-design.md.
 if (pathname === "/") return null;
 return <motion.header initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
  <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
   <Link href="/" className="flex items-center gap-3">
    <Image src="/iut-logo.png" alt="IUT logo" width={36} height={36} priority className="h-9 w-9 rounded-lg border border-border object-contain bg-transparent" />
    <div className="hidden sm:block"><p className="text-sm font-semibold tracking-tight">IUT · IPE</p><p className="font-mono text-[8px] uppercase tracking-[.22em] text-muted-foreground">Industrial & Production Engineering</p></div>
   </Link>
   <nav className="hidden items-center gap-1 md:flex">{LINKS.map(l=><Link key={l.href} href={l.href} className={cn("rounded-full px-4 py-2 text-xs font-medium transition",pathname===l.href?"bg-muted text-foreground":"text-muted-foreground hover:bg-muted/50 hover:text-foreground")}>{l.label}</Link>)}</nav>
   <div className="flex items-center gap-2">
    <button onClick={()=>window.dispatchEvent(new Event(OPEN_CHAT_EVENT))} className="hidden items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-2 text-xs font-semibold text-accent sm:flex"><Sparkles className="h-3.5 w-3.5"/> Ask IPE AI</button>
    <ThemeToggle />
    <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-muted/30 md:hidden" onClick={()=>setOpen(!open)} aria-label="menu">{open?<X className="h-4 w-4"/>:<Menu className="h-4 w-4"/>}</button>
   </div>
  </div>
  <AnimatePresence>{open&&<motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden border-t border-border md:hidden"><div className="mx-auto max-w-7xl px-5 py-3">{LINKS.map(l=><Link onClick={()=>setOpen(false)} key={l.href} href={l.href} className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">{l.label}</Link>)}<button onClick={()=>{setOpen(false);window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-accent"><Sparkles className="h-4 w-4"/>Ask IPE AI</button></div></motion.div>}</AnimatePresence>
 </motion.header>
}
