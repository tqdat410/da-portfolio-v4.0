"use client";

import Image from "next/image";
import { content, type ProjectItem } from "@/content";

interface ProjectDetailPanelProps {
  project: ProjectItem;
  onClose: () => void;
}

export function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  const labels = content.projectPopup;

  return (
    <div className="h-full bg-white">
      {/* Close button */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center">
        <button
          onClick={onClose}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Close
        </button>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-56">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-6 pb-8 -mt-12 relative">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{project.title}</h2>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-text-secondary border border-slate-200">
            {labels.type}: {project.type}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-text-secondary border border-slate-200">
            {labels.duration}: {project.duration}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-text-secondary border border-slate-200">
            {labels.status}: {project.status}
          </span>
        </div>

        {/* Overview */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.overview}</h3>
          <p className="text-text-body leading-relaxed">{project.longDescription}</p>
        </section>

        {/* Role */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.role}</h3>
          <p className="text-text-body">{project.role}</p>
        </section>

        {/* Learnings */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.learning}</h3>
          <p className="text-text-body">{project.learning}</p>
        </section>

        {/* Technologies */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.technologies}</h3>
          <div className="flex flex-wrap gap-2">
            {project.fullTechStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-text-primary text-white text-sm font-medium hover:bg-text-primary/90 transition-colors"
            >
              {labels.viewLive}
            </a>
          )}
          {project.github &&
            (typeof project.github === "string" ? (
              project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg border border-text-primary/40 text-text-primary text-sm font-medium hover:bg-text-primary/5 transition-colors"
                >
                  {labels.viewSource}
                </a>
              )
            ) : (
              project.github.map((repo) => (
                <a
                  key={repo.label}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg border border-text-primary/40 text-text-primary text-sm font-medium hover:bg-text-primary/5 transition-colors"
                >
                  {repo.label}
                </a>
              ))
            ))}
        </div>
      </div>
    </div>
  );
}
