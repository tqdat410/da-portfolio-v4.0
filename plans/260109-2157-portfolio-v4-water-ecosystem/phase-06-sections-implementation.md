# Phase 06: Sections Implementation

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 05](./phase-05-navbar-effects.md) | **Next:** [Phase 07](./phase-07-polish-optimization.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | completed (2026-01-10) |
| Effort | 5h |
| Dependencies | Phase 02, Phase 05 |

Implement all content sections: Hero, About (with skills/education/certificates), Projects (grid with modal), and Contact. All content from en.json/vn.json.

---

## Key Insights (from Mock Data Analysis)

### Data Structure Summary

| Section | Key Fields |
|---------|------------|
| Hero | greeting, name, role, description, status, downloadCv, resumeUrl |
| About | description, dob, basicInfo, education, skills (5 categories), certificates |
| Projects | 11 items with title, description, techStack, github, url, image |
| Contact | title, description, email, phone, linktree, socialLinks |

### Skills Categories
- Backend: SAP ABAP, Java, Spring Boot, Python, etc.
- Frontend: ReactJS, NextJS, Three.js, etc.
- Database: PostgreSQL, MySQL, MongoDB, etc.
- Tools: Docker, Kafka, CI/CD, Git
- AI Tools: Claude Code, Cursor, Gemini CLI, etc.

---

## Requirements

1. **Hero Section**: Name, role, description, status badge, CTA buttons
2. **About Section**: Info cards, education timeline, skills grid, certificates accordion
3. **Projects Section**: Responsive grid, project cards with hover effects, modal for details
4. **Contact Section**: Contact info, social links grid
5. All text from locale files (i18n)
6. Responsive layouts (desktop-first)
7. Subtle entrance animations

---

## Architecture

```
src/components/sections/
├── Hero/
│   ├── Hero.tsx
│   ├── StatusBadge.tsx
│   └── CTAButtons.tsx
├── About/
│   ├── About.tsx
│   ├── InfoCard.tsx
│   ├── SkillsGrid.tsx
│   ├── EducationTimeline.tsx
│   └── CertificatesAccordion.tsx
├── Projects/
│   ├── Projects.tsx
│   ├── ProjectCard.tsx
│   └── ProjectModal.tsx
└── Contact/
    ├── Contact.tsx
    └── SocialLinks.tsx
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/components/sections/Hero/Hero.tsx` | Hero section component |
| `src/components/sections/About/About.tsx` | About section with tabs |
| `src/components/sections/About/SkillsGrid.tsx` | Skills by category |
| `src/components/sections/Projects/Projects.tsx` | Projects grid |
| `src/components/sections/Projects/ProjectCard.tsx` | Individual project card |
| `src/components/sections/Projects/ProjectModal.tsx` | Project detail modal |
| `src/components/sections/Contact/Contact.tsx` | Contact info and links |

---

## Implementation Steps

### Step 1: Hero Section (45 min)

Create `src/components/sections/Hero/Hero.tsx`:

```typescript
"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/layout/Section";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <Section id="home" className="relative">
      <div className="text-center max-w-3xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-accent/10 border border-teal-accent/30">
          <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
          <span className="text-sm text-aqua-bright">{t("status")}</span>
        </div>

        {/* Greeting */}
        <p className="text-lg md:text-xl text-teal-accent mb-2">
          {t("greeting")}
        </p>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-light-aqua mb-4 tracking-tight">
          {t("name")}
        </h1>

        {/* Role */}
        <p className="text-xl md:text-2xl text-aqua-bright mb-6">
          {t("role")}
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-deep-ocean/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {t("description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="
              px-8 py-3 rounded-lg
              bg-teal-accent text-midnight font-medium
              hover:bg-aqua-bright transition-colors
              shadow-lg shadow-teal-accent/20
            "
          >
            {t("cta")}
          </a>
          <a
            href={t("resumeUrl_en")}
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-8 py-3 rounded-lg
              border border-teal-accent/50 text-aqua-bright
              hover:bg-teal-accent/10 transition-colors
            "
          >
            {t("downloadCv")}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
        </div>
      </div>
    </Section>
  );
}
```

### Step 2: About Section Components (60 min)

Create `src/components/sections/About/SkillsGrid.tsx`:

```typescript
"use client";

import { useTranslations } from "next-intl";

interface SkillCategory {
  title: string;
  items: string[];
}

export function SkillsGrid() {
  const t = useTranslations("About.skills");
  const categories = t.raw("categories") as Record<string, SkillCategory>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(categories).map(([key, category]) => (
        <div
          key={key}
          className="
            p-6 rounded-xl
            bg-midnight/50 border border-teal-accent/20
            hover:border-teal-accent/40 transition-colors
          "
        >
          <h4 className="text-lg font-semibold text-aqua-bright mb-4">
            {category.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill) => (
              <span
                key={skill}
                className="
                  px-3 py-1 text-sm rounded-full
                  bg-teal-accent/10 text-light-aqua
                  border border-teal-accent/20
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
```

Create `src/components/sections/About/About.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/layout/Section";
import { SkillsGrid } from "./SkillsGrid";

type Tab = "info" | "skills" | "education" | "certificates";

export function About() {
  const t = useTranslations("About");
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: t("basicInfo.title") },
    { id: "skills", label: t("skills.title") },
    { id: "education", label: t("education.title") },
    { id: "certificates", label: t("certificates.title") },
  ];

  return (
    <Section id="about">
      <div className="w-full max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-light-aqua text-center mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-aqua-bright max-w-2xl mx-auto mb-8">
          {t("description")}
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all
                ${activeTab === tab.id
                  ? "bg-teal-accent text-midnight"
                  : "bg-teal-accent/10 text-light-aqua hover:bg-teal-accent/20"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard label={t("basicInfo.locationLabel")} value={t("basicInfo.location")} />
              <InfoCard label={t("basicInfo.languagesLabel")} value={t("basicInfo.languages")} />
              <InfoCard label={t("basicInfo.statusLabel")} value={t("basicInfo.status")} />
            </div>
          )}

          {activeTab === "skills" && <SkillsGrid />}

          {activeTab === "education" && (
            <div className="max-w-xl mx-auto">
              {(t.raw("education.items") as any[]).map((edu, i) => (
                <div key={i} className="p-6 rounded-xl bg-midnight/50 border border-teal-accent/20">
                  <h4 className="text-xl font-semibold text-aqua-bright">{edu.school}</h4>
                  <p className="text-light-aqua">{edu.degree}</p>
                  <p className="text-teal-accent">{edu.year}</p>
                  <p className="text-deep-ocean">{edu.gpa}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-4">
              {(t.raw("certificates.items") as any[]).map((group, i) => (
                <details key={i} className="group">
                  <summary className="
                    flex justify-between items-center cursor-pointer
                    p-4 rounded-lg bg-midnight/50 border border-teal-accent/20
                    hover:border-teal-accent/40
                  ">
                    <span className="text-aqua-bright font-medium">{group.name}</span>
                    <span className="text-teal-accent">{group.count} certificates</span>
                  </summary>
                  <div className="mt-2 pl-4 space-y-2">
                    {group.items.map((cert: any, j: number) => (
                      <div key={j} className="p-3 rounded-lg bg-midnight/30 border border-teal-accent/10">
                        <p className="text-light-aqua text-sm">{cert.name}</p>
                        <p className="text-deep-ocean text-xs">{cert.provider}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-xl bg-midnight/50 border border-teal-accent/20 text-center">
      <p className="text-sm text-teal-accent mb-1">{label}</p>
      <p className="text-lg text-light-aqua">{value}</p>
    </div>
  );
}
```

### Step 3: Projects Section (75 min)

Create `src/components/sections/Projects/ProjectCard.tsx`:

```typescript
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
        bg-midnight/50 border border-teal-accent/20
        hover:border-teal-accent/50 transition-all duration-300
        text-left w-full
      "
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-light-aqua mb-2 group-hover:text-aqua-bright transition-colors">
          {title}
        </h3>
        <p className="text-sm text-deep-ocean line-clamp-2 mb-4">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded bg-teal-accent/10 text-teal-accent"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-deep-ocean">
              +{techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="
        absolute inset-0 bg-teal-accent/5
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none
      " />
    </button>
  );
}
```

Create `src/components/sections/Projects/ProjectModal.tsx`:

```typescript
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
```

Create `src/components/sections/Projects/Projects.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const t = useTranslations("Projects");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = t.raw("items") as any[];

  return (
    <Section id="projects">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-light-aqua text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              techStack={project.techStack}
              image={project.image}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Section>
  );
}
```

### Step 4: Contact Section (30 min)

Create `src/components/sections/Contact/Contact.tsx`:

```typescript
"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/layout/Section";

const SOCIAL_ICONS: Record<string, string> = {
  github: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  // Add more icons as needed
};

export function Contact() {
  const t = useTranslations("Contact");
  const social = useTranslations("SocialLinks");

  const socialLinks = [
    { key: "github", url: social("github") },
    { key: "linkedin", url: social("linkedin") },
    { key: "gmail", url: social("gmail") },
    { key: "facebook", url: social("facebook") },
    { key: "telegram", url: social("telegram") },
    { key: "discord", url: social("discord") },
  ];

  return (
    <Section id="contact">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-light-aqua mb-6">
          {t("title")}
        </h2>
        <p className="text-lg text-deep-ocean mb-12 max-w-xl mx-auto">
          {t("description")}
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-midnight/50 border border-teal-accent/20">
            <p className="text-sm text-teal-accent mb-1">{t("emailLabel")}</p>
            <a href={`mailto:${t("email")}`} className="text-aqua-bright hover:text-light-aqua transition-colors">
              {t("email")}
            </a>
          </div>
          <div className="p-6 rounded-xl bg-midnight/50 border border-teal-accent/20">
            <p className="text-sm text-teal-accent mb-1">{t("phoneLabel")}</p>
            <a href={`tel:${t("phone")}`} className="text-aqua-bright hover:text-light-aqua transition-colors">
              {t("phone")}
            </a>
          </div>
        </div>

        {/* Social Links */}
        <p className="text-sm text-deep-ocean mb-6">{t("cta")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map(({ key, url }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12 h-12 rounded-lg
                flex items-center justify-center
                bg-teal-accent/10 border border-teal-accent/20
                text-light-aqua hover:text-aqua-bright
                hover:border-teal-accent/50 hover:bg-teal-accent/20
                transition-all
              "
              aria-label={key}
            >
              {SOCIAL_ICONS[key] ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={SOCIAL_ICONS[key]} />
                </svg>
              ) : (
                <span className="text-xs uppercase">{key.slice(0, 2)}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

### Step 5: Update Main Page (15 min)

Update `src/app/[locale]/page.tsx`:

```typescript
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero/Hero";
import { About } from "@/components/sections/About/About";
import { Projects } from "@/components/sections/Projects/Projects";
import { Contact } from "@/components/sections/Contact/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="scroll-smooth">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
```

### Step 6: Create Index Exports (10 min)

Create `src/components/sections/index.ts`:

```typescript
export { Hero } from "./Hero/Hero";
export { About } from "./About/About";
export { Projects } from "./Projects/Projects";
export { Contact } from "./Contact/Contact";
```

---

## Todo List

- [ ] Create Hero section with status badge and CTA buttons
- [ ] Create About section with tabbed navigation
- [ ] Create SkillsGrid component
- [ ] Create Projects section with grid layout
- [ ] Create ProjectCard component with hover effects
- [ ] Create ProjectModal component with full details
- [ ] Create Contact section with social links
- [ ] Update main page to use all sections
- [ ] Create barrel exports
- [ ] Test all sections with both locales
- [ ] Verify images load from Cloudinary
- [ ] Test modal open/close and accessibility
- [ ] Test responsive layouts

---

## Success Criteria

1. All sections render content from locale files
2. Projects modal opens/closes correctly
3. All external links work and open in new tab
4. Responsive layouts work at all breakpoints
5. Tab navigation in About section works
6. Language switching updates all content
7. Images lazy load correctly

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Image loading slow | Medium | Medium | Use Next.js Image with priority for hero |
| Modal scroll issues on mobile | Medium | Medium | Lock body scroll when modal open |
| t.raw() type issues | Medium | Low | Use type assertions with any[] |

---

## Security Considerations

- All external links use rel="noopener noreferrer"
- No user input processed
- Images from trusted Cloudinary domain only

---

## Next Steps

Proceed to [Phase 07 - Polish & Optimization](./phase-07-polish-optimization.md) for final performance tuning, accessibility improvements, and SEO.
