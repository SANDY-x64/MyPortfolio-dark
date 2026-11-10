"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { CinematicScene } from "./cinematic-canvas";
import { EASE } from "./reveal";
import type { Project } from "@/lib/data";

interface CaseStudyProps {
  project: Project;
  index: number;
  total: number;
  nextTitle: string;
  onClose: () => void;
  onNext: () => void;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function CaseStudy({
  project,
  index,
  total,
  nextTitle,
  onClose,
  onNext,
}: CaseStudyProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      className="fixed inset-0 z-[95] overflow-y-auto overscroll-contain bg-[#0a0a0a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/85 px-5 py-3 backdrop-blur-md md:px-10">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/50">
          CASE {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          className="flex h-9 items-center gap-2.5 rounded-full border border-white/20 px-4 font-mono text-[10px] tracking-[0.25em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
        >
          CLOSE
          <X size={12} aria-hidden="true" />
        </button>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 pb-24 md:px-10">

        <motion.header {...fadeUp(0.1)} className="pt-12 md:pt-16">
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/40">
            {project.category}
          </p>
          <h3 className="mt-4 text-[clamp(2.6rem,6.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white">
            {project.title}
          </h3>
          <p className="mt-4 font-mono text-[11px] tracking-[0.25em] text-white/45">
            {project.client} — {project.year}
          </p>
        </motion.header>

        <motion.div
          {...fadeUp(0.2)}
          className="mt-10 border border-white/10 bg-[#0d0d0d] md:mt-14"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <CinematicScene
              kind={project.scene}
              seed={project.seed}
              words={project.words}
              speed={1}
              className="absolute inset-0"
              label={`${project.title} — main clip`}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[12.5%] items-center justify-between bg-black px-4 md:px-6">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/45 md:text-[10px]">
                {project.id.toUpperCase()}_MASTER.MP4
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/45 md:text-[10px]">
                2.39:1
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[12.5%] items-center justify-between bg-black px-4 md:px-6">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/55 md:text-[10px]">
                RUNTIME {project.runtime}
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/55 md:text-[10px]">
                {project.role.join(" · ")}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {[
            { label: "CLIENT", value: project.client },
            { label: "YEAR", value: project.year },
            { label: "RUNTIME", value: project.runtime },
            { label: "ROLE", value: project.role.join(" & ") },
          ].map((m) => (
            <div key={m.label} className="bg-[#0a0a0a] p-4 md:p-5">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/40">
                {m.label}
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.12em] text-white/85">
                {m.value}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-14">
          <motion.section {...fadeUp(0.35)}>
            <h4 className="border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.3em] text-white/40">
              THE BRIEF
            </h4>
            <p className="mt-5 text-[15px] leading-relaxed text-white/65">
              {project.brief}
            </p>
          </motion.section>
          <motion.section {...fadeUp(0.4)}>
            <h4 className="border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.3em] text-white/40">
              THE CUT
            </h4>
            <p className="mt-5 text-[15px] leading-relaxed text-white/65">
              {project.cut}
            </p>
          </motion.section>
        </div>

        <motion.section {...fadeUp(0.45)} className="mt-14 md:mt-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/40">
              SELECTS — FROM THE BIN
            </h4>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
              BIN 01
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.selects.map((s) => (
              <figure key={s.tc} className="border border-white/10">
                <div className="relative aspect-video overflow-hidden bg-[#0d0d0d]">
                  <CinematicScene
                    kind={s.scene}
                    seed={s.seed}
                    words={s.words}
                    speed={1.15}
                    className="absolute inset-0"
                    label={`Select clip at timecode ${s.tc}`}
                  />
                </div>
                <figcaption className="flex items-center justify-between px-3 py-2.5 font-mono text-[9px] tabular-nums tracking-[0.2em] text-white/40">
                  <span>CLIP_{s.tc}</span>
                  <span>2.39:1</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.section>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
          <motion.section {...fadeUp(0.5)}>
            <h4 className="border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.3em] text-white/40">
              DELIVERABLES
            </h4>
            <p className="mt-5 font-mono text-xs leading-loose tracking-[0.1em] text-white/60">
              {project.deliverables}
            </p>
          </motion.section>
          <motion.section {...fadeUp(0.55)}>
            <h4 className="border-b border-white/10 pb-3 font-mono text-[10px] tracking-[0.3em] text-white/40">
              TOOLKIT
            </h4>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {project.toolkit.map((t) => (
                <li
                  key={t}
                  className="border border-white/15 px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] text-white/70"
                >
                  {t}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <motion.button
          {...fadeUp(0.6)}
          onClick={onNext}
          data-cursor
          className="group mt-16 flex w-full items-center justify-between gap-6 border-t border-white/10 pt-10 text-left md:mt-24"
        >
          <span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
              NEXT PROJECT
            </span>
            <span className="mt-3 block text-3xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-white/70 md:text-5xl">
              {nextTitle}
            </span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="h-8 w-8 shrink-0 text-white/50 transition-all duration-500 group-hover:translate-x-2 group-hover:text-white md:h-10 md:w-10"
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
