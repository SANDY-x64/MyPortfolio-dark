"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { PROFILE, SOCIALS } from "@/lib/data";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {

    }
  };

  return (
    <button
      onClick={copy}
      aria-live="polite"
      className="flex h-[52px] items-center gap-2 border border-white/20 px-5 font-mono text-[10px] tracking-[0.3em] text-white/70 transition-colors duration-300 hover:border-white/50 hover:text-white md:text-[11px]"
    >
      {copied ? (
        <>
          COPIED
          <Check size={13} aria-hidden="true" />
        </>
      ) : (
        "COPY ADDRESS"
      )}
    </button>
  );
}

export function Contact() {
  return (
    <footer
      id="contact"
      aria-label="Contact"
      className="mt-auto scroll-mt-20 border-t border-white/10"
    >
      <section className="px-5 pb-10 pt-24 md:px-10 md:pt-36">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            index="05"
            title="CONTACT"
            meta="FOR PROJECTS & COLLABORATIONS"
          />

          <div className="mt-14 md:mt-24">
            <Reveal>
              <h2 className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-white">
                LET&apos;S CUT
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="font-serif text-[clamp(2.7rem,8.6vw,7.6rem)] italic leading-[1.05] tracking-[-0.01em] text-white/85">
                something together.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-center md:justify-between">
            <Reveal delay={0.18} className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${PROFILE.email}`}
                className="group flex h-[52px] items-center gap-3 border border-white/20 px-6 font-mono text-xs tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-black md:text-sm"
              >
                {PROFILE.email.toUpperCase()}
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <CopyEmail />
            </Reveal>

            <Reveal
              delay={0.24}
              className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-white/55"
            >
              <span className="animate-breathe h-2 w-2 shrink-0 rounded-full bg-white" />
              {PROFILE.availability}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-20 md:mt-28">
            <ul className="flex flex-wrap gap-x-10 gap-y-3 border-y border-white/10 py-6">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    {s.label}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-8 flex flex-col gap-2.5 pb-4 font-mono text-[9px] tracking-[0.22em] text-white/30 md:flex-row md:items-center md:justify-between">
            <span>© 2026 {PROFILE.name.toUpperCase()} — ALL RIGHTS RESERVED</span>
            <span>EDITED & DESIGNED BY {PROFILE.name} · {PROFILE.location}</span>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-white/70"
            >
              BACK TO TOP
              <ArrowUp
                size={12}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
