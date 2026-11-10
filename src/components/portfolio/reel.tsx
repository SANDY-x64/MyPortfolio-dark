"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { CinematicScene } from "./cinematic-canvas";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import {
  REEL_CHAPTERS,
  REEL_STARTS,
  REEL_TOTAL,
  chapterAt,
  toTimecode,
} from "@/lib/data";

export function Reel() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [flash, setFlash] = useState(0);

  const tRef = useRef(0);
  const chRef = useRef(0);
  const tcRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const render = () => {
    if (tcRef.current) tcRef.current.textContent = toTimecode(tRef.current);
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${tRef.current / REEL_TOTAL})`;
    }
  };

  const goTo = (sec: number) => {
    tRef.current = Math.max(0, Math.min(REEL_TOTAL - 0.05, sec));
    const ch = chapterAt(tRef.current);
    if (ch !== chRef.current) {
      chRef.current = ch;
      setChapter(ch);
      setFlash((f) => f + 1);
    }
    render();
  };

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tRef.current += dt;
      if (tRef.current >= REEL_TOTAL) tRef.current -= REEL_TOTAL;
      const ch = chapterAt(tRef.current);
      if (ch !== chRef.current) {
        chRef.current = ch;
        setChapter(ch);
        setFlash((f) => f + 1);
      }
      render();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    if (!started) {
      setStarted(true);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const playChapter = (i: number) => {
    setStarted(true);
    setPlaying(true);
    goTo(REEL_STARTS[i] + 0.01);
  };

  const current = REEL_CHAPTERS[chapter];

  return (
    <section
      id="reel"
      aria-label="Featured reel"
      className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="01"
          title="FEATURED REEL"
          meta={`SHOWREEL_2025.MP4 — RUNTIME ${toTimecode(REEL_TOTAL)}`}
        />

        <Reveal className="mt-10 md:mt-14">
          <div className="border border-white/10 bg-[#0d0d0d] shadow-[0_40px_120px_-40px_rgba(255,255,255,0.08)]">

            <div
              className="relative aspect-video w-full select-none overflow-hidden"
              onClick={toggle}
              data-cursor
              role="button"
              tabIndex={0}
              aria-label={
                started
                  ? playing
                    ? "Pause reel"
                    : "Play reel"
                  : "Play showreel"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }}
            >
              {started ? (
                <CinematicScene
                  kind={current.kind}
                  seed={current.seed}
                  words={current.words}
                  playing={playing && !reduced}
                  className="absolute inset-0"
                  label={`Showreel chapter: ${current.label}`}
                />
              ) : (
                <CinematicScene
                  kind="orbit"
                  seed={5}
                  playing={false}
                  className="absolute inset-0"
                  label="Showreel poster frame"
                />
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[12.5%] items-center justify-between bg-black px-4 md:px-6">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/45 md:text-[10px]">
                  SANDY — SHOWREEL 2025
                </span>
                <span className="hidden font-mono text-[9px] tracking-[0.25em] text-white/45 sm:block md:text-[10px]">
                  4K · 24FPS · 2.39:1
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[12.5%] items-center justify-between bg-black px-4 md:px-6">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/55 md:text-[10px]">
                  CH.{String(chapter + 1).padStart(2, "0")} — {current.label}
                </span>
                <span className="font-mono text-[9px] tabular-nums tracking-[0.2em] text-white/55 md:text-[10px]">
                  <span ref={tcRef}>00:00:00:00</span>
                </span>
              </div>

              {flash > 0 && started ? (
                <motion.div
                  key={`flash-${flash}`}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-white"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              ) : null}

              {!started ? (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/45">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    aria-label="Play showreel"
                    className="group flex h-20 w-20 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-500 hover:scale-105 hover:border-white hover:bg-white hover:text-black md:h-24 md:w-24"
                  >
                    <Play size={22} className="ml-1" />
                  </button>
                  <p className="font-mono text-[10px] tracking-[0.35em] text-white/60">
                    PLAY SHOWREEL — {Math.round(REEL_TOTAL)} SECONDS
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 px-4 py-3 md:gap-6 md:px-6">
              <button
                onClick={toggle}
                aria-label={playing ? "Pause reel" : "Play reel"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                {playing ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </button>

              <div
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(REEL_TOTAL)}
                aria-valuenow={Math.round(tRef.current)}
                data-cursor
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  goTo(((e.clientX - r.left) / r.width) * REEL_TOTAL);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") goTo(tRef.current + 1);
                  if (e.key === "ArrowLeft") goTo(tRef.current - 1);
                }}
                className="relative h-8 flex-1 outline-none"
              >
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />

                {REEL_STARTS.map((s, i) =>
                  i === 0 ? null : (
                    <div
                      key={s}
                      aria-hidden="true"
                      className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-white/30"
                      style={{ left: `${(s / REEL_TOTAL) * 100}%` }}
                    />
                  )
                )}
                <div
                  ref={barRef}
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 origin-left bg-white/80"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/40">
                {toTimecode(REEL_TOTAL)}
              </span>
              <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.2em] text-white/35 xl:block">
                SOUND OFF — MIX IN POST
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-7">
          <div className="flex flex-wrap gap-x-7 gap-y-2.5">
            {REEL_CHAPTERS.map((c, i) => (
              <button
                key={c.label}
                onClick={() => playChapter(i)}
                className={`font-mono text-[10px] tracking-[0.25em] transition-colors duration-300 md:text-[11px] ${
                  started && i === chapter
                    ? "text-white"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
