"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CinematicScene } from "./cinematic-canvas";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { CaseStudy } from "./case-study";
import { PROJECTS } from "@/lib/data";

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="02"
          title="SELECTED WORK"
          meta="2019 — 2025 · 05 PROJECTS"
        />

        <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-14 md:mt-16 md:gap-x-6 md:gap-y-24">
          {PROJECTS.map((p, i) => (
            <Reveal
              key={p.id}
              className={`col-span-12 ${p.span}`}
              delay={0.05}
            >
              <article className="group">
                <button
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`Open case study: ${p.title} — ${p.category.toLowerCase()}, ${p.year}`}
                  className={`relative block w-full overflow-hidden border border-white/10 bg-[#0d0d0d] text-left outline-none transition-colors duration-500 focus-visible:border-white/50 ${p.aspect}`}
                >
                  <CinematicScene
                    kind={p.scene}
                    seed={p.seed}
                    words={p.words}
                    speed={hovered === i ? 1.9 : 0.55}
                    className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
                    label={`${p.title} — abstract clip preview`}
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-[5] bg-black/0 transition-colors duration-500 group-hover:bg-black/30"
                  />

                  <div className="absolute inset-0 z-10 flex items-end justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-6">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/85">
                      VIEW CASE STUDY
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-sm text-white/85 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 z-10 border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] tabular-nums tracking-[0.2em] text-white/70 backdrop-blur-sm md:right-6 md:top-6">
                    {p.runtime}
                  </div>
                </button>

                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-white/10 pt-3.5">
                  <div className="flex min-w-0 items-baseline gap-3 md:gap-4">
                    <span className="font-mono text-[10px] tabular-nums text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="truncate text-xl font-medium tracking-tight text-white md:text-2xl">
                      {p.title}
                    </h3>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-white/40">
                    {p.category} — {p.year}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null ? (
          <CaseStudy
            key={PROJECTS[active].id}
            project={PROJECTS[active]}
            index={active}
            total={PROJECTS.length}
            nextTitle={PROJECTS[(active + 1) % PROJECTS.length].title}
            onClose={() => setActive(null)}
            onNext={() => setActive((a) => ((a ?? 0) + 1) % PROJECTS.length)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
