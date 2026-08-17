"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
  cursorClassName?: string;
  hideCursorWhenDone?: boolean;
};

/** Reveals `text` one character at a time; leaves a blinking `|` cursor while typing. */
export function Typewriter({ text, speed = 30, startDelay = 0, onDone, className, cursorClassName, hideCursorWhenDone = true }: Props) {
  const [started, setStarted] = useState(startDelay <= 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (startDelay <= 0) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [started, count, text, speed]);

  const done = count >= text.length;

  useEffect(() => {
    if (done) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {(!done || !hideCursorWhenDone) && <span className={cn("animate-pulse", cursorClassName)}>|</span>}
    </span>
  );
}
