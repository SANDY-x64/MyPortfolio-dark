"use client";

import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { SKILLS } from "@/lib/data";

export function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="03"
          title="SKILLS"
          meta="WHAT THE DAYS ARE MADE OF"
        />

        <div className="mt-10 border-t border-white/10 md:mt-16">
          {SKILLS.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.06} y={20}>
              <div className="group -mx-2 grid grid-cols-12 items-baseline gap-y-3 border-b border-white/10 px-2 py-8 transition-colors duration-500 hover:bg-white/[0.03] md:-mx-4 md:gap-y-4 md:px-4 md:py-11">
                <span className="col-span-2 font-mono text-[11px] tabular-nums text-white/35 transition-colors duration-500 group-hover:text-white/70 md:col-span-1">
                  {s.index}
                </span>
                <h3 className="col-span-10 text-2xl font-medium tracking-tight text-white md:col-span-4 md:text-4xl">
                  {s.title}
                </h3>
                <p className="col-span-10 col-start-3 text-sm leading-relaxed text-white/50 md:col-span-5 md:col-start-auto">
                  {s.desc}
                </p>
                <div className="col-span-10 col-start-3 flex flex-wrap gap-x-4 gap-y-1.5 md:col-span-2 md:col-start-auto md:justify-end">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] tracking-[0.25em] text-white/35"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
