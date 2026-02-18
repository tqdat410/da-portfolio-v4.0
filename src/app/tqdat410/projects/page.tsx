import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsExplorerPageClient } from "@/components/projects-explorer/projects-explorer-page-client";
import { buildProjectsTree, getAllProjectDocs } from "@/lib/projects-markdown";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse project markdown files through a folder-style explorer.",
};

export default async function Tqdat410ProjectsPage() {
  const docs = await getAllProjectDocs();
  const tree = buildProjectsTree(docs);

  return (
    <Suspense fallback={<div className="h-dvh bg-[var(--brand-fg)]" />}>
      <ProjectsExplorerPageClient docs={docs} tree={tree} />
    </Suspense>
  );
}
