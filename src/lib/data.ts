

export type SceneKind =
  | "orbit"
  | "dust"
  | "streaks"
  | "bars"
  | "type"
  | "waves"
  | "grid";

export interface Profile {
  name: string;
  logo: string;
  role: string;
  email: string;
  location: string;
  coordinates: string;
  availability: string;
  years: string;
  stats: string;
}

export const PROFILE: Profile = {
  name: "SANDY",
  logo: "S",
  role: "VIDEO EDITOR & MOTION DESIGNER",
  email: "stickmind8@gmail.com",
  location: "CSE STUDENT",
  coordinates: "AI + TRADITIONAL VIDEO EDITING",
  availability: "OPEN TO PROJECTS & COLLABORATIONS",
  years: "CSE STUDENT",
  stats: "EDITORIAL · COLOR GRADING · MOTION DESIGN",
};

export interface ReelChapter {
  label: string;
  kind: SceneKind;
  dur: number;
  seed: number;
  words?: string[];
}

export const REEL_CHAPTERS: ReelChapter[] = [
  {
    label: "TITLES",
    kind: "type",
    dur: 5,
    seed: 101,
    words: ["SANDY", "SHOWREEL", "MMXXV", "EDIT", "GRADE", "MIX"],
  },
  { label: "COMMERCIAL", kind: "streaks", dur: 6, seed: 102 },
  { label: "DOCUMENTARY", kind: "dust", dur: 7, seed: 103 },
  { label: "MUSIC VIDEO", kind: "bars", dur: 6, seed: 104 },
  { label: "FINISHING", kind: "waves", dur: 6, seed: 105 },
];

export const REEL_STARTS: number[] = REEL_CHAPTERS.reduce<number[]>(
  (acc, _c, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + REEL_CHAPTERS[i - 1].dur);
    return acc;
  },
  []
);

export const REEL_TOTAL: number = REEL_CHAPTERS.reduce(
  (acc, c) => acc + c.dur,
  0
);

export const REEL_FPS = 24;

export function chapterAt(t: number): number {
  let idx = 0;
  for (let i = 0; i < REEL_CHAPTERS.length; i++) {
    if (t >= REEL_STARTS[i]) idx = i;
  }
  return idx;
}

export function toTimecode(sec: number, fps: number = REEL_FPS): string {
  const total = Math.max(0, sec);
  const f = Math.floor((total % 1) * fps);
  const s = Math.floor(total) % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
}

export interface SelectClip {
  tc: string;
  scene: SceneKind;
  seed: number;
  words?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  runtime: string;
  role: string[];
  scene: SceneKind;
  seed: number;
  words: string[];

  span: string;

  aspect: string;
  brief: string;
  cut: string;
  deliverables: string;
  toolkit: string[];
  selects: SelectClip[];
}

export const PROJECTS: Project[] = [
  {
    id: "neon-district",
    title: "Neon District",
    category: "BRAND FILM",
    client: "VANTA APPAREL",
    year: "2025",
    runtime: "01:32",
    role: ["LEAD EDITOR", "COLORIST"],
    scene: "streaks",
    seed: 11,
    words: ["NEON", "DISTRICT", "VANTA", "SS25"],
    span: "md:col-span-7",
    aspect: "aspect-[16/10] md:aspect-[16/9]",
    brief:
      "A night-driven brand film for VANTA Apparel's SS25 drop — shot across three nights in downtown Los Angeles with a skeleton crew and zero artificial light. The brief was simple and a little dangerous: make a streetwear film that feels like the city at 2AM. Restless, glossy, and a little lonely.",
    cut: "The edit leans on acceleration — 214 cuts in 92 seconds, average shot length 0.43s, building from long observational holds to strobe-fast match cuts on garment details. The grade pushes sodium-vapor warmth against deep, quiet shadows; no preset looks, built shot by shot.",
    deliverables: "60s hero film · 15s & 6s cutdowns · 9:16 social series (12) · key art loops",
    toolkit: ["PREMIERE PRO", "RESOLVE", "AFTER EFFECTS", "FRAME.IO"],
    selects: [
      { tc: "00:00:12:08", scene: "streaks", seed: 31 },
      { tc: "00:00:41:16", scene: "type", seed: 32, words: ["SS25", "VANTA"] },
      { tc: "00:01:03:22", scene: "grid", seed: 33 },
    ],
  },
  {
    id: "the-quiet-coast",
    title: "The Quiet Coast",
    category: "DOCUMENTARY",
    client: "NORTHLIGHT FILMS",
    year: "2024",
    runtime: "12:48",
    role: ["EDITOR", "SOUND DESIGN"],
    scene: "dust",
    seed: 4,
    words: ["THE", "QUIET", "COAST"],
    span: "md:col-span-5",
    aspect: "aspect-[16/10] md:aspect-[4/3]",
    brief:
      "A meditative short documentary following the last three lighthouse keepers on the Pacific coast. Forty hours of footage — fog, rope, radio static, long silences — distilled into twelve minutes about people who measure their lives in tide tables.",
    cut: "Structured in three movements, cut from interview transcripts rather than a script. The average shot runs six seconds because the film is allowed to breathe. Sound design carries the middle act — room tone recorded on location, mixed to broadcast loudness. Selected at two festivals.",
    deliverables: "12:48 festival master · broadcast version · 90s trailer · subtitled FR/ES/DE",
    toolkit: ["PREMIERE PRO", "AUDITION", "RESOLVE"],
    selects: [
      { tc: "00:02:17:11", scene: "dust", seed: 41 },
      { tc: "00:05:44:03", scene: "waves", seed: 42 },
      { tc: "00:09:02:19", scene: "orbit", seed: 43 },
    ],
  },
  {
    id: "half-light",
    title: "Half Light",
    category: "MUSIC VIDEO",
    client: "MIRA",
    year: "2024",
    runtime: "03:57",
    role: ["EDITOR", "MOTION DESIGN"],
    scene: "bars",
    seed: 7,
    words: ["HALF", "LIGHT", "MIRA"],
    span: "md:col-span-5",
    aspect: "aspect-[16/10] md:aspect-[4/3]",
    brief:
      "A synth-pop single about leaving the city at dusk. Performance footage shot on vintage broadcast cameras, intercut with 16mm b-roll and a run of small typographic moments. The label asked for a video that edits like the song feels — so the timeline became the instrument.",
    cut: "Every cut lands on the grid at 92 BPM; the second verse degrades into half-speed echoes before snapping back for the final chorus. 480 clips conformed, 38 hand-built type cards, all motion driven by expressions in-frame — no plugins, no presets.",
    deliverables: "3:57 master · vertical performance edit · lyric video · 3 teaser loops",
    toolkit: ["PREMIERE PRO", "AFTER EFFECTS", "RESOLVE"],
    selects: [
      { tc: "00:00:58:20", scene: "bars", seed: 51 },
      { tc: "00:01:46:05", scene: "type", seed: 52, words: ["MIRA", "HALF"] },
      { tc: "00:03:12:14", scene: "waves", seed: 53 },
    ],
  },
  {
    id: "meridian",
    title: "Meridian",
    category: "PRODUCT FILM",
    client: "ALTO AUDIO",
    year: "2023",
    runtime: "02:10",
    role: ["EDITOR", "FINISHING"],
    scene: "grid",
    seed: 2,
    words: ["MERIDIAN", "ALTO", "SOUND"],
    span: "md:col-span-7",
    aspect: "aspect-[16/10] md:aspect-[16/9]",
    brief:
      "Launch film for ALTO Audio's flagship headphones — macro product photography, exploded CG views and a score that behaves like a product demo. The film had to feel engineered: every transition machined, every beat earned, nothing decorative.",
    cut: "Cut on product beats rather than music beats — the score was written to the timeline, then re-recorded to match it. Macro shots conformed to 2.39:1 and graded HDR-first before the SDR trim pass. Delivered alongside a silent 1:1 retail loop that runs all day in forty stores.",
    deliverables: "2:10 launch film · 30s spot · 1:1 retail loop · HDR + SDR masters",
    toolkit: ["PREMIERE PRO", "RESOLVE", "CINEMA 4D"],
    selects: [
      { tc: "00:00:31:09", scene: "grid", seed: 61 },
      { tc: "00:01:08:17", scene: "orbit", seed: 62 },
      { tc: "00:01:44:02", scene: "streaks", seed: 63 },
    ],
  },
  {
    id: "field-notes",
    title: "Field Notes",
    category: "TITLE SEQUENCE",
    client: "FORMAT FESTIVAL",
    year: "2023",
    runtime: "00:45",
    role: ["EDIT", "DESIGN"],
    scene: "type",
    seed: 9,
    words: ["FIELD", "NOTES", "FORMAT", "VOL.4", "2023"],
    span: "md:col-span-12",
    aspect: "aspect-[16/10] md:aspect-[21/9]",
    brief:
      "A kinetic-type opening for FORMAT Festival's film programme — forty-five seconds of letters behaving badly. Designed to be cut live: the sequence ships with alternate endings so the festival could refresh it for every screening night.",
    cut: "38 type cards, each cut on the composer's click track. The system is deliberately rigid — one typeface, two weights, no curves — so all of the energy comes from rhythm instead of ornament. Shortlisted for a title-design award; the rigidity is the point.",
    deliverables: "45s title sequence · 3 alternate endings · stingers (4) · lower-third kit",
    toolkit: ["AFTER EFFECTS", "PREMIERE PRO", "FIGMA"],
    selects: [
      { tc: "00:00:06:21", scene: "type", seed: 71, words: ["FIELD", "NOTES"] },
      { tc: "00:00:19:07", scene: "waves", seed: 72 },
      { tc: "00:00:33:13", scene: "bars", seed: 73 },
    ],
  },
];

export interface Skill {
  index: string;
  title: string;
  desc: string;
  tags: string[];
}

export const SKILLS: Skill[] = [
  {
    index: "01",
    title: "Video Editing",
    desc: "I edit with both traditional techniques and AI tools, shaping footage into clear, engaging videos.",
    tags: ["AI WORKFLOWS", "TRADITIONAL EDITING", "VIDEO"],
  },
  {
    index: "02",
    title: "Color Grading",
    desc: "Color grading to shape the mood and visual style of each video.",
    tags: ["COLOR", "MOOD", "LOOK"],
  },
  {
    index: "03",
    title: "Editorial & Story",
    desc: "Thoughtful pacing and story structure help every edit feel clear and purposeful.",
    tags: ["EDITORIAL", "STORY", "PACING"],
  },
];

export const TOOLS: string[] = [
  "ADOBE PREMIERE PRO",
  "AFTER EFFECTS",
  "DAVINCI RESOLVE",
  "FINAL CUT PRO",
  "AUDITION",
  "PHOTOSHOP",
  "ILLUSTRATOR",
  "CINEMA 4D",
  "BLENDER",
  "FIGMA",
  "FRAME.IO",
  "AVID MEDIA COMPOSER",
];

export interface Social {
  label: string;
  href: string;
}

export const SOCIALS: Social[] = [
  { label: "GITHUB", href: "https://github.com/SANDY-x64" },
];
