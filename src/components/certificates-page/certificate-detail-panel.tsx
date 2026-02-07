"use client";

import { type CertificateItem } from "@/content";

interface CertificateDetailPanelProps {
  certificate: CertificateItem;
  groupName: string;
  onClose: () => void;
}

export function CertificateDetailPanel({ certificate, groupName, onClose }: CertificateDetailPanelProps) {
  return (
    <div className="h-full bg-white">
      {/* Close button */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center">
        <button
          onClick={onClose}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Close
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Certificate icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2">
          {certificate.name}
        </h2>

        {/* Meta */}
        <div className="space-y-3 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">Provider</span>
            <p className="text-text-body mt-0.5">{certificate.provider}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">Group</span>
            <p className="text-text-body mt-0.5">{groupName}</p>
          </div>
        </div>

        {/* View certificate link */}
        {certificate.url && (
          <a
            href={certificate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-text-primary text-white text-sm font-medium hover:bg-text-primary/90 transition-colors"
          >
            View Certificate
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {!certificate.url && (
          <p className="text-sm text-text-secondary italic">
            Certificate link not available
          </p>
        )}
      </div>
    </div>
  );
}
