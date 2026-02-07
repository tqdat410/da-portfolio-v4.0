"use client";

import { content } from "@/content";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const { projects, showcase } = content;

  return (
    <Section id="projects" className="bg-slate-300/10 !items-start !pt-24">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <h2 className="pacifico-regular text-4xl md:text-5xl text-text-primary text-center mb-16">
          {projects.title}
        </h2>

        {/* Showcase Bento Grid */}
        <div className="flex flex-col gap-12">
          {showcase.items.map((item, index) => (
            <ProjectCard
              key={item.category}
              title={item.title}
              description={item.description}
              techStack={item.techStack}
              image={item.mainImage}
              secondaryImage={item.secondaryImage}
              variant="bento"
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
