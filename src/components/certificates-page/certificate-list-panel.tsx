"use client";

import { content } from "@/content";

interface CertificateListPanelProps {
  selectedKey: string | null;
  onSelect: (groupIndex: number, itemIndex: number) => void;
}

export function CertificateListPanel({ selectedKey, onSelect }: CertificateListPanelProps) {
  const groups = content.about.certificates.items;

  return (
    <div className="h-full bg-slate-50">
      <div className="p-4 space-y-6">
        {groups.map((group, gIdx) => (
          <div key={group.name}>
            <h3 className="pacifico-regular text-xl text-text-primary mb-3 px-2 flex items-center gap-2">
              {group.name}
              <span className="text-sm font-sans text-text-secondary font-normal">
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
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-150 flex items-start gap-3 ${
                      isSelected
                        ? "bg-white border-l-3 border-slate-800 shadow-sm"
                        : "hover:bg-white/70 border-l-3 border-transparent"
                    }`}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {item.provider}
                      </p>
                    </div>

                    {/* Link indicator */}
                    {item.url && (
                      <div className="flex-shrink-0 mt-1">
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
