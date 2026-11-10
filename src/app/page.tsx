import { Grain } from "@/components/portfolio/grain";
import { Cursor } from "@/components/portfolio/cursor";
import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { Reel } from "@/components/portfolio/reel";
import { Projects } from "@/components/portfolio/projects";
import { Skills } from "@/components/portfolio/skills";
import { Tools } from "@/components/portfolio/tools";
import { Contact } from "@/components/portfolio/contact";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Grain />
      <Cursor />
      <Nav />

      <main className="flex-1">
        <Hero />
        <Reel />
        <Projects />
        <Skills />
        <Tools />
      </main>

      <Contact />
    </div>
  );
}
