"use client";

import { Reveal } from "./reveal";

interface SectionHeadingProps {
  index: string;
  title: string;
  meta?: string;
}

export function SectionHeading({ index, title, meta }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] tabular-nums text-white/40">
            [{index}]
          </span>
          <h2 className="font-mono text-[11px] tracking-[0.35em] text-white/90">
            {title}
          </h2>
        </div>
        {meta ? (
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-white/35 md:block">
            {meta}
          </span>
        ) : null}
      </div>
    </Reveal>
  );
}
