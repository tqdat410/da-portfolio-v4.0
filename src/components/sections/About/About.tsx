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
