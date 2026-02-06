"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { Section } from "@/components/layout/Section";
import { AnimatedWaterCanvas } from "@/components/water/AnimatedWaterCanvas";
import { content } from "@/content/portfolio";

/**
 * About section with clean editorial typography
 * Font roles:
 *   - Style Script: elegant keywords (same as Da'portfolio)
 *   - Default (Geist Sans): body text
 */
export function About() {
  const isMobile = useIsMobile();

  return (
    <Section id="about" className="bg-slate-300/10 !items-start !pt-24">
      <div className="w-full max-w-3xl mx-auto px-6 md:px-10">
        <p className="text-text-body text-justify leading-relaxed md:leading-loose text-base md:text-lg">
          Hello! I am a{" "}
          <span className="pacifico-regular text-2xl md:text-3xl text-text-primary">
            Final-Year
          </span>{" "}
          student pursuing{" "}
          <span className="pacifico-regular text-2xl md:text-3xl text-text-primary">
            Software Engineering
          </span>{" "}
          at{" "}
          <span className="underline decoration-1 underline-offset-4 text-text-primary font-medium">
            FPT University
          </span>
          , based in{" "}
          <span className="italic underline decoration-1 underline-offset-4 text-text-primary">
            Ho Chi Minh City, Vietnam
          </span>
          . Throughout my academic journey, I have had the opportunity to work on{" "}
          <span className="font-bold text-text-primary">diverse projects</span>
          {" "}— from web and mobile applications to enterprise solutions
          within and outside the SAP ecosystem, utilizing{" "}
          <span className="font-bold text-text-primary">AI tools</span>
          {" "}to enhance productivity.
          Currently, I am working as a{" "}
          <span className="pacifico-regular text-2xl md:text-3xl text-text-primary">
            Software Engineer
          </span>
          {" "}&{" "}
          <span className="pacifico-regular text-2xl md:text-3xl text-text-primary">
            SAP Technical Consultant
          </span>
          , bridging the gap between modern web technologies and enterprise solutions.
          I am passionate about crafting elegant and intuitive digital experiences
          that make a{" "}
          <span className="font-semibold text-text-primary">real impact</span>.
        </p>

        {/* About Detail Section - Redesign: Full Width Strip + Overlapping Cards */}
        <div className="relative mt-24 w-screen ml-[calc(50%-50vw)]">
          {/* Background Strip - Centered Vertically */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-0">
             <AnimatedWaterCanvas 
               name="About Me" 
               bgColor="#f1f5f9" 
               nameColor="#0f172a" 
               fontSize={isMobile ? 60 : 200}
             />
          </div>

          {/* Cards Container - Overlapping the strip */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Education Box */}
            {/* Education Box */}
            <div className="h-[500px] group relative p-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 rounded-2xl" />
              <h3 className="pacifico-regular text-3xl text-text-primary mb-6 relative z-10 text-center">Education</h3>
              <div className="flex flex-col gap-4 relative z-10 flex-1 overflow-y-auto no-scrollbar">
                {content.about.education.items.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-lg text-text-primary leading-tight">{item.school}</h4>
                    <p className="text-text-primary italic mt-1">{item.degree}</p>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-sm text-text-secondary font-mono bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200">{item.year}</p>
                       <p className="text-sm font-bold text-text-primary">{item.gpa}</p>
                    </div>
                  </div>
                ))}
                
                {/* Certifications */}
                {content.about.education.certifications && (
                  <div>
                    <h4 className="font-bold text-lg text-text-primary mb-2">Certifications</h4>
                    <div className="flex flex-col gap-2">
                      {content.about.education.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-slate-100/50 hover:bg-white border border-slate-200 rounded-lg cursor-pointer transition-colors duration-200 group/cert">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover/cert:bg-slate-600 transition-colors"></span>
                          <span className="text-sm text-text-body font-medium">{cert.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Box */}
            {/* Skills Box */}
            <div className="h-[500px] group relative p-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 rounded-2xl" />
              <h3 className="pacifico-regular text-3xl text-text-primary mb-6 relative z-10 text-center">Skills & Tools</h3>
              <div className="relative z-10 flex flex-col flex-1 overflow-y-auto no-scrollbar p-2">
                 <div className="flex flex-wrap justify-center gap-2">
                    {/* All Skills - Monochrome Style - Compact */}
                    {Object.values(content.about.skills.categories).flatMap((category) => category.items).map((skill, i) => (
                      <span key={`skill-${i}`} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:border-slate-300 cursor-default">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>
            </div>

            {/* Experience Box */}
            {/* Experience Box */}
            <div className="h-[500px] group relative p-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 rounded-2xl" />
              <h3 className="pacifico-regular text-3xl text-text-primary mb-6 relative z-10 text-center">Experience</h3>
              <div className="flex flex-col gap-4 relative z-10 flex-1 overflow-y-auto no-scrollbar">
                {content.about.experience.items.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-slate-300 last:border-0 last:pb-0">
                    <h4 className="font-bold text-lg text-text-primary leading-tight">{item.company}</h4>
                    <p className="text-text-primary italic mt-1 font-medium">{item.role}</p>
                    <p className="text-xs text-text-secondary font-mono mt-1 mb-2 bg-slate-100/50 inline-block px-2 py-0.5 rounded border border-slate-200">{item.period}</p>
                    <p className="text-sm text-text-body leading-relaxed text-justify">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Section>
  );
}





