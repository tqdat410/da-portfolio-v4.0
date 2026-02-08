"use client";

import { content } from "@/content";

interface CertificateListPanelProps {
  selectedKey: string | null;
  onSelect: (groupIndex: number, itemIndex: number) => void;
}

export function CertificateListPanel({ selectedKey, onSelect }: CertificateListPanelProps) {
  const groups = content.about.certificates.items;

  return (
    <div className="min-h-full bg-slate-50 overflow-y-auto">
      <div className="p-4 space-y-6 pb-20 md:pb-6">
        {groups.map((group, gIdx) => (
          <div key={group.name}>
            <h3 className="font-bold text-lg text-text-primary mb-3 px-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary"></span>
              {group.name}
              <span className="text-sm font-normal text-text-secondary">
                ({group.count})
              </span>
            </h3>
            <div className="space-y-1">
              {group.items.map((item, iIdx) => {
                const key = `${gIdx}-${iIdx}`;
                const isSelected = selectedKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => onSelect(gIdx, iIdx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-150 ${
                      isSelected
                        ? "bg-white border-l-3 border-slate-800 shadow-sm"
                        : "hover:bg-white/70 border-l-3 border-transparent"
                    }`}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {item.provider}
                      </p>
                    </div>

                    {/* Link indicator */}
                    {item.url && (
                      <div className="flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
