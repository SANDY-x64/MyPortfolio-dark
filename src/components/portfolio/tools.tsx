"use client";

import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { TOOLS } from "@/lib/data";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {[0, 1].map((dup) => (
          <div
            key={dup}
            aria-hidden={dup === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-mono text-xs tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-white md:px-10 md:text-base">
                  {t}
                </span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-white/25"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Tools() {
  const rowA = TOOLS;
  const rowB = [...TOOLS.slice(6), ...TOOLS.slice(0, 6)];

  return (
    <section
      id="tools"
      aria-label="Tools"
      className="scroll-mt-20 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading index="04" title="TOOLS" meta="THE EVERYDAY STACK" />
      </div>

      <Reveal className="marquee-hover mask-fade-x mt-12 space-y-7 md:mt-16">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-12 max-w-[1440px] px-5 md:mt-16 md:px-10">
        <p className="max-w-md font-mono text-[10px] leading-relaxed tracking-[0.2em] text-white/35">
          TOOLS CHANGE. TASTE DOESN&apos;T. THE STACK MATTERS LESS THAN THE
          DECISIONS MADE WITH IT — BUT THESE ARE HOME.
        </p>
      </Reveal>
    </section>
  );
}
