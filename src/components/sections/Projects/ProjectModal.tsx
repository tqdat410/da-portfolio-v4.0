"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Project {
  title: string;
  longDescription: string;
  fullTechStack: string[];
  role: string;
  type: string;
  duration: string;
  status: string;
  learning: string;
  github: string | { label: string; url: string }[];
  url: string;
  image: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations("ProjectPopup");

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          bg-midnight border border-teal-accent/30 rounded-2xl
          shadow-2xl shadow-teal-accent/10
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-midnight/80 text-light-aqua hover:text-aqua-bright"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          <h2 className="text-3xl font-bold text-light-aqua mb-2">{project.title}</h2>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <span className="text-teal-accent">{t("type")}: {project.type}</span>
            <span className="text-teal-accent">{t("duration")}: {project.duration}</span>
            <span className="text-teal-accent">{t("status")}: {project.status}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{t("overview")}</h3>
            <p className="text-deep-ocean leading-relaxed">{project.longDescription}</p>
          </div>

          {/* Role */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{t("role")}</h3>
            <p className="text-deep-ocean">{project.role}</p>
          </div>

          {/* Learning */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{t("learning")}</h3>
            <p className="text-deep-ocean">{project.learning}</p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aqua-bright mb-2">{t("technologies")}</h3>
            <div className="flex flex-wrap gap-2">
              {project.fullTechStack.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-teal-accent/10 text-light-aqua text-sm">
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
                {t("viewLive")}
              </a>
            )}
            {project.github && (
              typeof project.github === "string" ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-lg border border-teal-accent/50 text-aqua-bright hover:bg-teal-accent/10 transition-colors"
                >
                  {t("viewSource")}
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
