"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { EASE } from "./reveal";
import { PROFILE, toTimecode } from "@/lib/data";

const lineMotion = (delay: number) => ({
  initial: { y: "110%" },
  animate: { y: "0%" },
  transition: { duration: 1.1, delay, ease: EASE },
});

export function Hero() {
  const tcRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (tcRef.current) {
        tcRef.current.textContent = toTimecode((now - start) / 1000);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[80vh] w-[90vw] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[130px]"
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-10 pt-28 md:px-10 md:pt-36">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.3em] text-white/40 md:text-[11px]"
        >
          <span>
            {PROFILE.name.toUpperCase()} — {PROFILE.role}
          </span>
          <span className="hidden md:block">{PROFILE.coordinates}</span>
        </motion.div>

        <h1 className="my-auto py-16 md:py-20">
          <span className="block overflow-hidden">
            <motion.span
              {...lineMotion(0.35)}
              className="block text-[clamp(3.2rem,10.5vw,9.5rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-white"
            >
              EVERY FRAME
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              {...lineMotion(0.48)}
              className="block font-serif text-[clamp(3.4rem,11vw,10rem)] italic leading-[0.98] tracking-[-0.01em] text-white/85"
            >
              earns its
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              {...lineMotion(0.61)}
              className="block text-[clamp(3.2rem,10.5vw,9.5rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-white"
            >
              PLACE.
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-white/55 md:text-lg">
              I create videos using both AI and traditional editing workflows,
              with a focus on storytelling, color grading, and motion design.
            </p>
            <p className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/35">
              {PROFILE.years} · {PROFILE.stats}
            </p>
          </div>

          <div className="flex items-center justify-between gap-8 md:flex-col md:items-end md:gap-3">
            <a
              href="#reel"
              className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/60 transition-colors hover:text-white md:text-[11px]"
            >
              FEATURED REEL
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <span
              className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-white/30"
              aria-hidden="true"
            >
              TC <span ref={tcRef}>00:00:00:00</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
