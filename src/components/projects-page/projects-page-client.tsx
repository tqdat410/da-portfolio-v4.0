"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { content } from "@/content";
import { FlexibleColumnLayout } from "@/components/layout/flexible-column-layout";
import { ProjectListPanel } from "./project-list-panel";
import { ProjectDetailPanel } from "./project-detail-panel";

export function ProjectsPageClient() {
  const searchParams = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Auto-select project from query param on mount
  useEffect(() => {
    const projectParam = searchParams.get("project");
    if (projectParam) {
      const index = content.projects.items.findIndex(
        (p) => p.title === projectParam
      );
      if (index !== -1) setSelectedIndex(index);
    }
  }, [searchParams]);

  const selectedProject =
    selectedIndex !== null ? content.projects.items[selectedIndex] : null;

  return (
    <div className="h-dvh flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Portfolio
          </Link>
          <h1 className="pacifico-regular text-2xl text-text-primary">Projects</h1>
        </div>
        <span className="text-sm text-text-secondary">
          {content.projects.items.length} projects
        </span>
      </header>

      {/* FCL Content */}
      <div className="flex-1 min-h-0">
        {/* Desktop: FCL layout */}
        <div className="hidden md:block h-full">
          <FlexibleColumnLayout
            listPanel={
              <ProjectListPanel
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
              />
            }
            detailPanel={
              selectedProject ? (
                <ProjectDetailPanel
                  project={selectedProject}
                  onClose={() => setSelectedIndex(null)}
                />
              ) : null
            }
          />
        </div>

        {/* Mobile: stacked layout */}
        <div className="block md:hidden h-full overflow-y-auto bg-slate-50">
          {selectedProject ? (
            <ProjectDetailPanel
              project={selectedProject}
              onClose={() => setSelectedIndex(null)}
            />
          ) : (
            <ProjectListPanel
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
