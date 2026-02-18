import type { Metadata } from "next";
import { CertificatesExplorerPageClient } from "@/components/certificates-explorer/certificates-explorer-page-client";
import { buildCertificatesTree, getCertificatesDoc } from "@/lib/certificates-markdown";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Browse certificate markdown and links through a folder-style explorer.",
};

export default async function Tqdat410CertificatesPage() {
  const doc = await getCertificatesDoc();
  const tree = buildCertificatesTree(doc);

  return <CertificatesExplorerPageClient doc={doc} tree={tree} />;
}
