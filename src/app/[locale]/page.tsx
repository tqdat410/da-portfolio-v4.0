import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Navbar />

      <main id="main-content" className="scroll-smooth">
        {/* Hero Section */}
        <Section id="home">
          <div className="text-center max-w-2xl">
            <p className="text-aqua-bright mb-2">{t("Hero.greeting")}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-light-mint mb-4">
              {t("Hero.name")}
            </h1>
            <p className="text-xl text-teal-accent">{t("Hero.role")}</p>
            <p className="mt-6 text-mint text-sm max-w-lg mx-auto leading-relaxed">
              {t("Hero.description")}
            </p>
            <div className="mt-8">
              <a
                href="#projects"
                className="
                  inline-block px-8 py-3
                  bg-teal-accent/10 text-aqua-bright
                  border border-teal-accent/30 rounded-lg
                  hover:bg-teal-accent/20 hover:border-teal-accent/50
                  hover:shadow-[0_0_20px_rgba(56,178,172,0.2)]
                  transition-all duration-300
                "
              >
                {t("Hero.cta")}
              </a>
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-light-mint mb-4">{t("About.title")}</h2>
            <p className="text-mint">{t("About.description")}</p>
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-light-mint mb-4">{t("Projects.title")}</h2>
            <p className="text-mint">Projects will be displayed here</p>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-light-mint mb-4">{t("Contact.title")}</h2>
            <p className="text-mint">{t("Contact.description")}</p>
          </div>
        </Section>
      </main>
    </>
  );
}
