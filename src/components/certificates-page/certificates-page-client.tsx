"use client";

import { useState } from "react";
import Link from "next/link";
import { content } from "@/content";
import { FlexibleColumnLayout } from "@/components/layout/flexible-column-layout";
import { CertificateListPanel } from "./certificate-list-panel";
import { CertificateDetailPanel } from "./certificate-detail-panel";

export function CertificatesPageClient() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const groups = content.about.certificates.items;

  // Parse selected key to get certificate
  const selectedCertificate = (() => {
    if (!selectedKey) return null;
    const [gIdx, iIdx] = selectedKey.split("-").map(Number);
    const group = groups[gIdx];
    if (!group) return null;
    const item = group.items[iIdx];
    if (!item) return null;
    return { certificate: item, groupName: group.name };
  })();

  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);

  const handleSelect = (groupIndex: number, itemIndex: number) => {
    setSelectedKey(`${groupIndex}-${itemIndex}`);
  };

  return (
    <div className="reverse-scrollbar h-dvh flex flex-col bg-bg-primary">
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
          <h1 className="pacifico-regular text-2xl text-text-primary">Certificates</h1>
        </div>
        <span className="text-sm text-text-secondary">
          {totalCount} certificates
        </span>
      </header>

      {/* FCL Content */}
      <div className="flex-1 min-h-0">
        {/* Desktop: FCL layout */}
        <div className="hidden md:block h-full">
          <FlexibleColumnLayout
            listPanel={
              <CertificateListPanel
                selectedKey={selectedKey}
                onSelect={handleSelect}
              />
            }
            detailPanel={
              selectedCertificate ? (
                <CertificateDetailPanel
                  certificate={selectedCertificate.certificate}
                  groupName={selectedCertificate.groupName}
                  onClose={() => setSelectedKey(null)}
                />
              ) : null
            }
          />
        </div>

        {/* Mobile: stacked layout */}
        <div className="block md:hidden h-full overflow-y-auto bg-slate-50">
          {selectedCertificate ? (
            <CertificateDetailPanel
              certificate={selectedCertificate.certificate}
              groupName={selectedCertificate.groupName}
              onClose={() => setSelectedKey(null)}
            />
          ) : (
            <CertificateListPanel
              selectedKey={selectedKey}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
