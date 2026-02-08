"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content, type ProjectItem } from "@/content";
import { LinkIcon } from "@/components/icons/link-icon";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const labels = content.projectPopup;
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on escape key and Focus Trap
  useEffect(() => {
    if (!project) return;

    // Focus close button when modal opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [project, onClose]);

  // Prevent scroll when modal open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const externalLink = project.links.find(l => l.icon === "demo" || l.icon === "external");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="
          relative w-full max-w-3xl max-h-[90vh] flex flex-col
          bg-white border border-bg-secondary rounded-2xl
          shadow-2xl shadow-text-primary/20
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-text-primary hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-text-primary"
          aria-label={labels.close}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-y-auto relative rounded-2xl">
          {/* Image */}
          <div className="relative h-64">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>

        {/* Content */}
        <div className="p-6 -mt-16 relative">
          <h2 id="modal-title" className="text-3xl font-bold text-text-primary mb-1">
            {project.title}
          </h2>
          {project.tagline && (
            <p className="text-text-secondary text-sm mb-4">{project.tagline}</p>
          )}

          {/* Meta Info (Type & Status) */}
          <div className="flex items-center gap-4 mb-6 text-sm font-medium">
             <div className="flex items-center gap-1.5 text-text-secondary">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {project.type}
             </div>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <div className={`flex items-center gap-1.5 ${
                project.status === "Live" || project.status === "Active" ? "text-emerald-600" :
                project.status === "Stopped" ? "text-red-600" :
                project.status === "Completed" ? "text-blue-600" : "text-slate-500"
             }`}>
               <span className="w-2 h-2 rounded-full bg-current" />
               {project.status}
             </div>
          </div>

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
              <ul className="list-disc list-inside text-accent-shadow leading-relaxed pl-1 space-y-1">
                {project.keyFeatures.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Role & Responsibilities */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.role}</h3>
            <p className="text-accent-shadow mb-2">{project.role}</p>
            {project.responsibilities.length > 0 && (
              <ul className="list-disc list-inside text-accent-shadow leading-relaxed pl-1 space-y-1">
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
              <p className="text-accent-shadow leading-relaxed">{project.architecture}</p>
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

          {/* Results */}
          {project.results && project.results.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Results & Impact</h3>
              <ul className="list-disc list-inside text-accent-shadow leading-relaxed pl-1 space-y-1">
                {project.results.map((result, i) => (
                  <li key={i}>{result}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Learning */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">{labels.learning}</h3>
            <p className="text-accent-shadow">{project.learning}</p>
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
        <div className="h-20" />
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
    </div>
  );
}
