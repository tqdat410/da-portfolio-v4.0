"use client";

import Image from "next/image";
import { content, type ProjectItem } from "@/content";
import { LinkIcon } from "@/components/icons/link-icon";

interface ProjectDetailPanelProps {
  project: ProjectItem;
  onClose: () => void;
}

export function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  const labels = content.projectPopup;
  const externalLink = project.links.find(l => l.icon === "demo" || l.icon === "external");

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/30 px-6 py-3 flex items-center justify-between z-10 shrink-0 shadow-sm">
        <div className="flex flex-col">
           <h2 className="text-lg font-bold text-text-primary truncate leading-tight">{project.title}</h2>
           <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-text-secondary">{project.type}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className={`${
                project.status === "Live" || project.status === "Active" ? "text-emerald-600" :
                project.status === "Stopped" ? "text-red-600" :
                project.status === "Completed" ? "text-blue-600" : "text-slate-500"
              }`}>
                {project.status}
              </span>
           </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/50 text-text-secondary transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-y-auto relative">

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
      <div className="px-6 pb-24 -mt-12 relative">
        {/* Overview */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.overview}</h3>
          <p className="text-accent-shadow leading-relaxed">{project.overview}</p>
        </section>

        {/* Duration / Timeline */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Timeline</h3>
          <p className="text-accent-shadow"><span className="font-medium">Duration/Date:</span> {project.duration}</p>
        </section>

        {/* Key Features */}
        {project.keyFeatures.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Key Features</h3>
            <ul className="list-disc list-inside text-text-body leading-relaxed pl-1 space-y-1">
              {project.keyFeatures.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Role & Responsibilities */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.role}</h3>
          <p className="text-text-body mb-2">{project.role}</p>
          {project.responsibilities.length > 0 && (
            <ul className="list-disc list-inside text-text-body leading-relaxed pl-1 space-y-1">
              {project.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Architecture */}
        {project.architecture && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Architecture</h3>
            <p className="text-text-body leading-relaxed">{project.architecture}</p>
          </section>
        )}

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

        {/* Results & Impact */}
        {project.results && project.results.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Results & Impact</h3>
            <ul className="list-disc list-inside text-text-body leading-relaxed pl-1 space-y-1">
              {project.results.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Key Learnings */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.learning}</h3>
          <p className="text-text-body">{project.learning}</p>
        </section>

        {/* Resources */}
        {project.links.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Resources</h3>
            <div className="flex flex-wrap gap-3">
              {project.links.filter(l => l.icon === "github" || l.icon === "docs").map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-text-primary/40 text-text-primary text-sm font-medium hover:bg-text-primary/5 transition-colors flex items-center gap-2"
                >
                  <LinkIcon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* History */}
        {project.history && project.history.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Project History</h3>
            <div className="space-y-4">
              {[...project.history].reverse().map((version) => (
                <div key={version.version} className="border-l-2 border-slate-200 pl-4 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-text-primary">{version.version}</span>
                    <div className="flex gap-1">
                      {version.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-text-secondary border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-text-body mb-2">{version.description}</p>
                  {version.links && (
                    <div className="flex gap-2">
                       {version.links.map(link => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-text-secondary hover:text-text-primary underline"
                          >
                             <LinkIcon icon={link.icon} /> {link.label}
                          </a>
                       ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Spacer for footer */}
        <div className="pb-24"></div>
      </div>
      </div>

      {/* Footer Tools Bar - Floating */}
      {externalLink && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-none px-6">
            <div className="bg-white/60 backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-12 pointer-events-auto min-w-[320px]">
              {/* Status (Left) */}
              <div className="flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${
                      project.status === "Live" || project.status === "Active" ? "bg-emerald-500" :
                      project.status === "Stopped" ? "bg-red-500" :
                      project.status === "Completed" ? "bg-blue-500" : "bg-slate-400"
                   }`} />
                   <span className="text-sm font-medium text-text-secondary">{project.status}</span>
              </div>

              {/* Action Button (Right) */}
              <a
                href={externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <LinkIcon icon="external" />
                Visit
              </a>
            </div>
        </div>
      )}
    </div>
  );
}
