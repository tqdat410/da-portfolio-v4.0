"use client";

import Image from "next/image";
import { content, type ProjectItem, type ProjectCategory } from "@/content";

/** Category display order */
const CATEGORY_ORDER: ProjectCategory[] = ["SAP", "Startup", "Educational", "Personal"];

/** Status badge colors */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  };
  const cls = colors[status] || colors["Completed"];
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${cls}`}>
      {status}
    </span>
  );
}

interface ProjectListPanelProps {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function ProjectListPanel({ selectedIndex, onSelect }: ProjectListPanelProps) {
  const items = content.projects.items;

  // Group projects by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    projects: items
      .map((p, i) => ({ ...p, originalIndex: i }))
      .filter((p) => p.category === cat),
  })).filter((g) => g.projects.length > 0);

  return (
    <div className="h-full bg-slate-50">
      <div className="p-4 space-y-6">
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="pacifico-regular text-xl text-text-primary mb-3 px-2">
              {group.category}
            </h3>
            <div className="space-y-1">
              {group.projects.map((project) => (
                <ProjectListItem
                  key={project.originalIndex}
                  project={project}
                  isSelected={selectedIndex === project.originalIndex}
                  onClick={() => onSelect(project.originalIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  isSelected,
  onClick,
}: {
  project: ProjectItem & { originalIndex: number };
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-150 ${
        isSelected
          ? "bg-white border-l-3 border-slate-800 shadow-sm"
          : "hover:bg-white/70 border-l-3 border-transparent"
      }`}
      aria-current={isSelected ? "true" : undefined}
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {project.title}
          </h4>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
          {project.description}
        </p>
      </div>
    </button>
  );
}
