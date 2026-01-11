"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content, type ProjectItem } from "@/content";

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="
          relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          bg-midnight border border-teal-accent/30 rounded-2xl
          shadow-2xl shadow-teal-accent/10
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-midnight/80 text-light-aqua hover:text-aqua-bright focus:outline-none focus:ring-2 focus:ring-teal-accent"
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

        {/* Image */}
        <div className="relative h-64">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 -mt-16 relative">
          <h2 id="modal-title" className="text-3xl font-bold text-light-aqua mb-2">
            {project.title}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <span className="text-teal-accent">
              {labels.type}: {project.type}
            </span>
            <span className="text-teal-accent">
              {labels.duration}: {project.duration}
            </span>
            <span className="text-teal-accent">
              {labels.status}: {project.status}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{labels.overview}</h3>
            <p className="text-deep-ocean leading-relaxed">{project.longDescription}</p>
          </div>

          {/* Role */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{labels.role}</h3>
            <p className="text-deep-ocean">{project.role}</p>
          </div>

          {/* Learning */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{labels.learning}</h3>
            <p className="text-deep-ocean">{project.learning}</p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{labels.technologies}</h3>
            <div className="flex flex-wrap gap-2">
              {project.fullTechStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-teal-accent/10 text-light-aqua text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg bg-teal-accent text-midnight font-medium hover:bg-aqua-bright transition-colors"
              >
                {labels.viewLive}
              </a>
            )}
            {project.github &&
              (typeof project.github === "string" ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-lg border border-teal-accent/50 text-aqua-bright hover:bg-teal-accent/10 transition-colors"
                >
                  {labels.viewSource}
                </a>
              ) : (
                project.github.map((repo) => (
                  <a
                    key={repo.label}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded-lg border border-teal-accent/50 text-aqua-bright hover:bg-teal-accent/10 transition-colors"
                  >
                    {repo.label}
                  </a>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
