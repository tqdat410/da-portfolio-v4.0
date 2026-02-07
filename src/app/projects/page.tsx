import { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectsPageClient } from "@/components/projects-page/projects-page-client";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse all my projects — from enterprise SAP solutions to creative side projects.",
};

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsPageClient />
    </Suspense>
  );
}
