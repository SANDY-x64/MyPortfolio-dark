"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { PROFILE } from "@/lib/data";

const LINKS = [
  { href: "#reel", label: "REEL" },
  { href: "#work", label: "WORK" },
  { href: "#skills", label: "SKILLS" },
  { href: "#tools", label: "TOOLS" },
  { href: "#contact", label: "CONTACT" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160);
  });

  return (
    <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[90] transition-colors duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-black/60 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 md:px-10"
        >
          <a
            href="#top"
            className="font-mono text-sm font-medium tracking-[0.25em] text-white"
            aria-label="Back to top"
          >
            {PROFILE.logo}
            <span className="text-white/40">©</span>
          </a>

          <ul className="flex items-center gap-4 md:gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-mono text-[10px] tracking-[0.25em] text-white/50 transition-colors duration-300 hover:text-white md:text-[11px]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2.5 lg:flex">
            <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-white" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/50">
              OPEN FOR WORK
            </span>
          </div>
        </nav>
      </motion.header>
  );
}
