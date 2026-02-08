"use client";

import { type CertificateItem } from "@/content";

interface CertificateDetailPanelProps {
  certificate: CertificateItem;
  groupName: string;
  onClose: () => void;
}

export function CertificateDetailPanel({ certificate, groupName, onClose }: CertificateDetailPanelProps) {
  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Header - matches project detail panel glassmorphism style */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/30 px-6 py-3 flex items-center justify-between z-10 shrink-0 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-text-primary truncate leading-tight">{certificate.name}</h2>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-text-secondary">{groupName}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-text-secondary">{certificate.provider}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/50 text-text-secondary transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="px-6 py-8 pb-24">
          {/* Certificate icon */}
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>

          {/* Details */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Provider</h3>
            <p className="text-accent-shadow leading-relaxed">{certificate.provider}</p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Group</h3>
            <p className="text-accent-shadow leading-relaxed">{groupName}</p>
          </section>

          {!certificate.url && (
            <p className="text-sm text-text-secondary italic">
              Certificate link not available
            </p>
          )}
        </div>
      </div>

      {/* Footer Tools Bar - Floating (matches project detail panel) */}
      {certificate.url && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-none px-6">
          <div className="bg-white/60 backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-6 md:gap-12 pointer-events-auto w-full md:w-auto md:min-w-[320px]">
            {/* Group info (Left) */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-text-secondary">Verified</span>
            </div>

            {/* Action Button (Right) */}
            <a
              href={certificate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Certificate
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
