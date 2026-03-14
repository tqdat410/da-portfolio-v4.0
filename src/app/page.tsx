import { Navbar, TopToolbar } from "@/components/layout";
import { HeroStory } from "@/components/story";
import { About } from "@/components/sections/About/About";
import { Contact } from "@/components/sections/Contact/Contact";
import { Footer } from "@/components/sections/Footer/Footer";

export default function HomePage() {
  return (
    <>
      <TopToolbar />
      <Navbar />
      <main id="main-content" className="scroll-smooth">
        <HeroStory />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
