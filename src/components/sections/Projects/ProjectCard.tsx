"use client";

import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type MouseEvent, type SetStateAction, useId, useRef, useState, useEffect } from "react";

/**
 * TechStackRow - Shows as many tech tags as fit in one row, with +X for overflow
 */
function TechStackRow({ techStack }: { techStack: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(techStack.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateVisible = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      let count = 0;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childRect = child.getBoundingClientRect();
        // Check if the child is within the container's visible area (single row)
        if (childRect.right <= containerRect.right + 2) {
          count++;
        } else {
          break;
        }
      }

      // Reserve space for the "+X" badge if needed
      if (count < techStack.length && count > 0) {
        count = Math.max(1, count - 1);
      }

      setVisibleCount(count);
    };

    // Initial calculation
    calculateVisible();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [techStack]);

  const hiddenCount = techStack.length - visibleCount;

  return (
    <div className="flex flex-nowrap gap-1.5 overflow-hidden" ref={containerRef}>
      {techStack.slice(0, visibleCount).map((tech) => (
        <span
          key={tech}
          className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100/80 text-[var(--brand-bg)] border border-slate-200/60 whitespace-nowrap flex-shrink-0"
        >
          {tech}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs text-[var(--brand-bg)]/70 whitespace-nowrap flex-shrink-0">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

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

function getProjectsExploreHref(title: string): string {
  if (title === "Custom Notification Center Fiori Application") {
    return "/tqdat410/projects?project=Custom+Notification+Center+Fiori+Application&folder=project%3Acustom-notification-center&view=preview";
  }

  if (title === "Hengout - Location Recommendation App") {
    return "/tqdat410/projects?project=Hengout+-+Location+Recommendation+App&folder=project%3Ahengout&view=preview";
  }

  return "/tqdat410/projects?project=Custom+Notification+Center+Fiori+Application&folder=category%3APersonal+%2F+Creative+Side+Projects&view=preview";
}

function ViewDetailsCircularText() {
  const pathId = useId();

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-28 w-28 md:h-36 md:w-36 animate-[spin_10s_linear_infinite]"
      aria-hidden="true"
    >
      <defs>
        <path
          id={pathId}
          d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
        />
      </defs>
      <text
        fill="var(--brand-bg)"
        fontSize="14"
        fontWeight="700"
        letterSpacing="1.6"
        style={{ textTransform: "uppercase" }}
      >
        <textPath href={`#${pathId}`}>
          View Details * View Details *
        </textPath>
      </text>
    </svg>
  );
}

interface CursorFollowerState {
  x: number;
  y: number;
  visible: boolean;
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
  const [mainFollower, setMainFollower] = useState<CursorFollowerState>({ x: 0, y: 0, visible: false });
  const [secondaryFollower, setSecondaryFollower] = useState<CursorFollowerState>({
    x: 0,
    y: 0,
    visible: false,
  });

  const updateFollower =
    (setter: Dispatch<SetStateAction<CursorFollowerState>>) =>
    (event: MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setter({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        visible: true,
      });
      };

  const projectsHref = getProjectsExploreHref(title);

  return (
    <div
      className="group w-full text-left"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Main Image - Takes 3/5 width, links to /projects */}
        <div className={`md:col-span-3 relative ${reversed ? 'md:order-2' : 'md:order-1'}`}>
          <Link
            href={projectsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/main relative w-full aspect-video h-full block ${mainFollower.visible ? "cursor-none" : ""}`}
            onMouseMove={updateFollower(setMainFollower)}
            onMouseEnter={updateFollower(setMainFollower)}
            onMouseLeave={() => setMainFollower((prev) => ({ ...prev, visible: false }))}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div
              className={`absolute pointer-events-none transition-opacity duration-150 ${mainFollower.visible ? "opacity-100" : "opacity-0"}`}
              style={{ left: `${mainFollower.x}px`, top: `${mainFollower.y}px`, transform: "translate(-50%, -50%)" }}
            >
              <ViewDetailsCircularText />
            </div>
            {/* Title overlay on main image */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {title}
              </h3>
            </div>
          </Link>
        </div>

        {/* Side Column - Secondary Image + Text */}
        <div className={`md:col-span-2 flex flex-col gap-4 ${reversed ? 'md:order-1' : 'md:order-2'}`}>
          {/* Secondary Image - links to /projects */}
          <div
            className={`group/secondary relative w-full aspect-video overflow-hidden ${reversed ? 'md:order-2' : 'md:order-1'}`}
          >
            <Link
              href={projectsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative w-full h-full block ${secondaryFollower.visible ? "cursor-none" : ""}`}
              onMouseMove={updateFollower(setSecondaryFollower)}
              onMouseEnter={updateFollower(setSecondaryFollower)}
              onMouseLeave={() => setSecondaryFollower((prev) => ({ ...prev, visible: false }))}
            >
              <Image
                src={secondaryImage || image}
                alt={`${title} secondary`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              <div
                className={`absolute pointer-events-none transition-opacity duration-150 ${secondaryFollower.visible ? "opacity-100" : "opacity-0"}`}
                style={{
                  left: `${secondaryFollower.x}px`,
                  top: `${secondaryFollower.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <ViewDetailsCircularText />
              </div>
            </Link>
          </div>

          {/* Text Block */}
          <div className={`flex-1 p-5 bg-[var(--brand-fg)] ${reversed ? 'md:order-1' : 'md:order-2'}`}>
            <p className="text-sm text-[var(--brand-bg)] line-clamp-3 mb-3">
              {description}
            </p>
            <TechStackRow techStack={techStack} />
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

