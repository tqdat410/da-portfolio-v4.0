"use client";

import { content } from "@/content";

export function SkillsGrid() {
  const categories = content.about.skills.categories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skills-grid">
      {Object.entries(categories).map(([key, category]) => (
        <div
          key={key}
          className="
            p-6 rounded-xl
            bg-white border border-steel-dark
            hover:border-text-primary/40 hover:shadow-md transition-all
          "
        >
          <h4 className="text-lg font-semibold text-text-primary mb-4">{category.title}</h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill: string) => (
              <span
                key={skill}
                className="
                  px-3 py-1 text-sm rounded-full
                  bg-bg-secondary text-text-secondary
                  border border-steel-dark
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
