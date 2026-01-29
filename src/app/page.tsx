import { Navbar, TopToolbar } from "@/components/layout";
import { HeroStory } from "@/components/story";
import { About } from "@/components/sections/About/About";
import { Projects } from "@/components/sections/Projects/Projects";
import { Contact } from "@/components/sections/Contact/Contact";

export default function HomePage() {
  return (
    <>
      <TopToolbar />
      <Navbar />
      <main id="main-content" className="scroll-smooth">
        <HeroStory />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
