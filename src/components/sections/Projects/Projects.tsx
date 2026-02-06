"use client";

import { useState } from "react";
import { content, type ProjectItem } from "@/content";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const projects = content.projects;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <Section id="projects" className="bg-slate-300/10">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-12">
          {projects.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.items.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              techStack={project.techStack}
              image={project.image}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}
