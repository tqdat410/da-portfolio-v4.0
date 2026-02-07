"use client";

import Image from "next/image";

type CardVariant = "featured" | "standard" | "compact" | "bento";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  secondaryImage?: string;
  variant?: CardVariant;
  reversed?: boolean;
  onClick?: () => void;
}

/**
 * Featured card - full-width hero with gradient overlay and text overlaid
 */
function FeaturedCard({ title, description, techStack, image, onClick }: Omit<ProjectCardProps, "variant">) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-80 overflow-hidden rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl text-left transition-all duration-300 hover:border-slate-300 hover:shadow-2xl"
      aria-label={`View project details for ${title}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 1200px) 100vw, 1152px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
          {title}
        </h3>
        <p className="text-sm md:text-base text-white/80 mb-4 max-w-2xl line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/**
 * Bento card - asymmetric grid with main image, secondary image, and text block
 * Layout: Main image (left/right) + stacked secondary image + text block
 */
function BentoCard({ 
  title, 
  description, 
  techStack, 
  image,
  secondaryImage,
  onClick,
  reversed = false 
}: Omit<ProjectCardProps, "variant"> & { reversed?: boolean }) {
  return (
    <div
      className="group w-full text-left"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Main Image - Takes 3/5 width */}
        <div className={`md:col-span-3 relative ${reversed ? 'md:order-2' : 'md:order-1'}`}>
          <div className="group/main relative w-full aspect-video h-full">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover grayscale group-hover/main:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            {/* Title overlay on main image */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Side Column - Secondary Image + Text */}
        <div className={`md:col-span-2 flex flex-col gap-4 ${reversed ? 'md:order-1' : 'md:order-2'}`}>
          {/* Secondary Image */}
          <div className={`group/secondary relative w-full aspect-video overflow-hidden ${reversed ? 'order-2' : 'order-1'}`}>
            <Image
              src={secondaryImage || image}
              alt={`${title} secondary`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale group-hover/secondary:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
          </div>

          {/* Text Block */}
          <div className={`flex-1 p-5 bg-slate-100/50 ${reversed ? 'order-1' : 'order-2'}`}>
            <p className="text-sm text-text-body line-clamp-3 mb-3">
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="px-1.5 py-0.5 text-xs text-accent-shadow">
                  +{techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard card - vertical layout, image top, content bottom, glassmorphism
 */
function StandardCard({ title, description, techStack, image, onClick }: Omit<ProjectCardProps, "variant">) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl text-left w-full transition-all duration-300 hover:bg-white hover:border-slate-300"
      aria-label={`View project details for ${title}`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-accent-shadow line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60 transition-all duration-300 hover:bg-white hover:border-slate-300"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="px-2 py-1 text-xs text-accent-shadow">
              +{techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * Compact card - horizontal layout, small thumbnail + text
 */
function CompactCard({ title, description, techStack, image, onClick }: Omit<ProjectCardProps, "variant">) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl text-left w-full transition-all duration-300 hover:bg-white hover:border-slate-300"
      aria-label={`View project details for ${title}`}
    >
      <div className="flex flex-col">
        <div className="relative h-32 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-text-secondary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-accent-shadow line-clamp-2 mb-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 2 && (
              <span className="px-1.5 py-0.5 text-[10px] text-accent-shadow">
                +{techStack.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function ProjectCard({ variant = "standard", reversed = false, ...props }: ProjectCardProps) {
  switch (variant) {
    case "featured":
      return <FeaturedCard {...props} />;
    case "bento":
      return <BentoCard {...props} reversed={reversed} />;
    case "compact":
      return <CompactCard {...props} />;
    default:
      return <StandardCard {...props} />;
  }
}
