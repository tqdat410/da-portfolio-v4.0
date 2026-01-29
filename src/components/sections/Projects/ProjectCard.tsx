"use client";

import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  onClick: () => void;
}

export function ProjectCard({ title, description, techStack, image, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        group relative overflow-hidden rounded-xl
        bg-white border border-steel-dark
        hover:border-text-primary/50 hover:shadow-lg transition-all duration-300
        text-left w-full
      "
      aria-label={`View project details for ${title}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-accent-shadow line-clamp-2 mb-4">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded bg-bg-secondary text-text-secondary"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-accent-shadow">
              +{techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="
        absolute inset-0 bg-accent-glow/20
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none
      " />
    </button>
  );
}
