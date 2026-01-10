import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero/Hero";
import { About } from "@/components/sections/About/About";
import { Projects } from "@/components/sections/Projects/Projects";
import { Contact } from "@/components/sections/Contact/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="scroll-smooth">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
