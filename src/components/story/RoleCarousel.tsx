"use client";

import { cn } from "@/lib/utils";

interface RoleCarouselProps {
  roles: string[];
  className?: string;
}

/**
 * Horizontal scrolling role titles for hero section
 * Displays roles in a single line with wide gaps for scroll animation
 */
export function RoleCarousel({ roles, className }: RoleCarouselProps) {
  return (
    <div className={cn("flex items-center gap-12 md:gap-24 whitespace-nowrap", className)}>
      {roles.map((role, index) => (
        <span
          key={role}
          className={cn(
            "text-2xl md:text-4xl lg:text-5xl font-light tracking-wide",
            // Alternate colors for visual interest
            index % 2 === 0 ? "text-aqua-bright/90" : "text-teal-accent/80"
          )}
        >
          {role}
        </span>
      ))}
    </div>
  );
}
