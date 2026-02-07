import type { Metadata } from "next";
import { CertificatesPageClient } from "@/components/certificates-page/certificates-page-client";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Browse all my certifications and academic achievements.",
};

export default function CertificatesPage() {
  return <CertificatesPageClient />;
}
