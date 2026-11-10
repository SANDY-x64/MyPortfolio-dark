"use client";

import { useEffect, useRef } from "react";
import type { SceneKind } from "@/lib/data";

interface Particle {
  x: number;
  y: number;
  r: number;
  spd: number;
  sway: number;
  ph: number;
  al: number;
}

interface Streak {
  y: number;
  len: number;
  spd: number;
  a: number;
  off: number;
  w: number;
}

interface BarSeed {
  p1: number;
  p2: number;
  f1: number;
  f2: number;
}

interface CinematicSceneProps {
  kind: SceneKind;
  seed?: number;
  playing?: boolean;
  speed?: number;
  words?: string[];
  className?: string;
  label?: string;
}

const DEFAULT_WORDS = ["AFTER", "BEFORE"];

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function CinematicScene({
  kind,
  seed = 1,
  playing = true,
  speed = 1,
  words = DEFAULT_WORDS,
  className,
  label,
}: CinematicSceneProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const wordsRef = useRef(words);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const reducedRefLive = { current: media.matches };
    const onMediaChange = (e: MediaQueryListEvent) => {
      reducedRefLive.current = e.matches;
    };
    media.addEventListener("change", onMediaChange);

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let staticDrawn = false;
    let last = performance.now();
    let t = seed * 7.31;

    const rand = mulberry32(seed * 1000 + 17);

    const particles: Particle[] =
      kind === "dust"
        ? Array.from({ length: 70 }, () => ({
            x: rand(),
            y: rand(),
            r: 0.6 + rand() * 1.8,
            spd: 0.008 + rand() * 0.02,
            sway: 0.01 + rand() * 0.03,
            ph: rand() * Math.PI * 2,
            al: 0.15 + rand() * 0.5,
          }))
        : [];

    const streaks: Streak[] =
      kind === "streaks"
        ? Array.from({ length: 9 }, () => ({
            y: 0.15 + rand() * 0.68,
            len: 0.12 + rand() * 0.3,
            spd: 0.05 + rand() * 0.12,
            a: 0.05 + rand() * 0.12,
            off: rand(),
            w: rand() < 0.3 ? 2 : 1,
          }))
        : [];

    const barSeeds: BarSeed[] =
      kind === "bars"
        ? Array.from({ length: 26 }, () => ({
            p1: rand() * Math.PI * 2,
            p2: rand() * Math.PI * 2,
            f1: 0.4 + rand() * 0.7,
            f2: 0.15 + rand() * 0.3,
          }))
        : [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      staticDrawn = false;
    };

    const vignette = () => {
      const g = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.35,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.75
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = () => {
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, w, h);

      switch (kind) {
        case "orbit": {
          const blobs = [
            {
              x: 0.5 + 0.28 * Math.sin(t * 0.13 + seed),
              y: 0.45 + 0.22 * Math.cos(t * 0.11 + seed * 2),
              r: 0.55,
              a: 0.1,
            },
            {
              x: 0.4 + 0.3 * Math.sin(t * 0.07 + 2),
              y: 0.55 + 0.3 * Math.cos(t * 0.09 + 1),
              r: 0.4,
              a: 0.07,
            },
            {
              x: 0.62 + 0.2 * Math.sin(t * 0.17 + 4),
              y: 0.4 + 0.25 * Math.sin(t * 0.08 + 3),
              r: 0.25,
              a: 0.08,
            },
          ];
          for (const b of blobs) {
            const r = Math.max(w, h) * b.r;
            const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r);
            g.addColorStop(0, `rgba(255,255,255,${b.a})`);
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
          }
          vignette();
          break;
        }

        case "dust": {
          for (const p of particles) {
            const y = (((p.y - t * p.spd) % 1) + 1) % 1;
            const x = (((p.x + Math.sin(t * 0.4 + p.ph) * p.sway) % 1) + 1) % 1;
            const tw = 0.55 + 0.45 * Math.sin(t * 1.3 + p.ph * 3);
            ctx.fillStyle = `rgba(255,255,255,${(p.al * tw * 0.5).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x * w, y * h, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          vignette();
          break;
        }

        case "streaks": {
          const hg = ctx.createLinearGradient(0, h * 0.62, 0, h);
          hg.addColorStop(0, "rgba(255,255,255,0)");
          hg.addColorStop(0.75, "rgba(255,255,255,0.05)");
          hg.addColorStop(1, "rgba(255,255,255,0.08)");
          ctx.fillStyle = hg;
          ctx.fillRect(0, h * 0.62, w, h * 0.38);
          for (const s of streaks) {
            const len = s.len * w;
            const total = w + len;
            const x = ((((s.off * total) + t * s.spd * w) % total) + total) % total - len;
            const g = ctx.createLinearGradient(x, 0, x + len, 0);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(0.5, `rgba(255,255,255,${s.a})`);
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.fillRect(x, s.y * h, len, s.w);
          }
          vignette();
          break;
        }

        case "bars": {
          const n = barSeeds.length;
          const bw = w / n;
          const base = h * 0.78;
          barSeeds.forEach((b, i) => {
            const v =
              0.15 +
              0.75 *
                (0.5 + 0.5 * Math.sin(t * b.f1 + b.p1)) *
                (0.5 + 0.5 * Math.sin(t * b.f2 + b.p2 + 1.3));
            const bh = v * h * 0.6;
            const x = i * bw + bw * 0.25;
            ctx.fillStyle = `rgba(255,255,255,${(0.06 + v * 0.22).toFixed(3)})`;
            ctx.fillRect(x, base - bh, bw * 0.5, bh);
            ctx.fillStyle = "rgba(255,255,255,0.04)";
            ctx.fillRect(x, base + 2, bw * 0.5, bh * 0.16);
          });
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fillRect(0, base, w, 1);
          vignette();
          break;
        }

        case "type": {
          const list = wordsRef.current;
          const idx = Math.floor(t / 0.85) % list.length;
          const local = t % 0.85;
          const inverted = idx % 3 === 2;
          ctx.fillStyle = inverted ? "#f2f2f2" : "#0b0b0b";
          ctx.fillRect(0, 0, w, h);
          if (local < 0.07) {
            ctx.fillStyle = inverted ? "#0b0b0b" : "#f2f2f2";
            ctx.fillRect(0, 0, w, h);
          } else {
            const jx = (((idx * 37) % 11) - 5) * w * 0.004;
            const jy = (((idx * 53) % 9) - 4) * h * 0.01;
            ctx.font = `600 ${Math.round(w * 0.14)}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = inverted ? "#0b0b0b" : "rgba(245,245,245,0.92)";
            ctx.fillText(list[idx], w / 2 + jx, h / 2 + jy);
            ctx.font = `400 ${Math.max(9, Math.round(w * 0.011))}px "JetBrains Mono", monospace`;
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = inverted ? "rgba(10,10,10,0.55)" : "rgba(245,245,245,0.4)";
            ctx.fillText(
              `CUT ${String(idx + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`,
              w * 0.04,
              h * 0.93
            );
          }
          break;
        }

        case "waves": {
          for (let k = 0; k < 3; k++) {
            ctx.beginPath();
            for (let x = 0; x <= w; x += 3) {
              const y =
                h * 0.5 +
                Math.sin(x * 0.012 + t * (0.9 + k * 0.25) + k * 2.1) *
                  h *
                  (0.06 + k * 0.035) +
                Math.sin(x * 0.004 - t * 0.3) * h * 0.03;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(255,255,255,${(0.1 + k * 0.06).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          vignette();
          break;
        }

        case "grid": {
          const horizon = h * 0.58;
          const vpx = w / 2;
          ctx.strokeStyle = "rgba(255,255,255,0.05)";
          ctx.lineWidth = 1;
          for (let i = -12; i <= 12; i++) {
            ctx.beginPath();
            ctx.moveTo(vpx + i * w * 0.012, horizon);
            ctx.lineTo(vpx + i * w * 0.09, h);
            ctx.stroke();
          }
          for (let j = 0; j < 12; j++) {
            const z = (j + ((t * 0.35) % 1)) / 12;
            const zz = z * z;
            const y = horizon + (h - horizon) * zz;
            ctx.strokeStyle = `rgba(255,255,255,${(0.02 + zz * 0.09).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }
          const hg = ctx.createLinearGradient(0, horizon - h * 0.12, 0, horizon);
          hg.addColorStop(0, "rgba(255,255,255,0)");
          hg.addColorStop(1, "rgba(255,255,255,0.06)");
          ctx.fillStyle = hg;
          ctx.fillRect(0, horizon - h * 0.12, w, h * 0.12);
          vignette();
          break;
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;

      const active = playingRef.current && !reducedRefLive.current;
      if (!active) {
        if (!staticDrawn) {
          staticDrawn = true;
          draw();
        }
        return;
      }
      staticDrawn = false;
      t += dt * speedRef.current;
      draw();
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf && w > 0) draw();
    });
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          last = performance.now();
          staticDrawn = false;
        }
      },
      { threshold: 0.02 }
    );
    io.observe(wrap);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      media.removeEventListener("change", onMediaChange);
    };
  }, [kind, seed]);

  return (
    <div
      ref={wrapRef}
      className={className}
      role="img"
      aria-label={label ?? "Abstract motion frame"}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
