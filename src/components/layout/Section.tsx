import { ReactNode } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * Full-viewport section wrapper.
 * Provides consistent padding for navbar offset.
 * Desktop: left padding for vertical navbar (w-16 = 64px)
 * Mobile: bottom padding for horizontal navbar (h-14 = 56px)
 */
export function Section({ id, children, className = "", ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={`
        min-h-screen w-full
        flex items-center justify-center
        p-4
        ${className}
      `}
      {...props}
    >
      {children}
    </section>
  );
}
