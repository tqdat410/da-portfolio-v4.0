"use client";

import { useState } from "react";
import { content } from "@/content";
import { Section } from "@/components/layout/Section";
import { SkillsGrid } from "./SkillsGrid";

type Tab = "info" | "skills" | "education" | "certificates";

export function About() {
  const about = content.about;
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: about.basicInfo.title },
    { id: "skills", label: about.skills.title },
    { id: "education", label: about.education.title },
    { id: "certificates", label: about.certificates.title },
  ];

  return (
    <Section id="about">
      <div className="w-full max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-4">
          {about.title}
        </h2>
        <p className="text-center text-text-secondary max-w-2xl mx-auto mb-8">{about.description}</p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-neon-cyan text-white shadow-lg shadow-text-primary/20"
                    : "bg-white text-text-secondary hover:bg-bg-secondary border border-steel-dark"
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
              <InfoCard label={about.basicInfo.locationLabel} value={about.basicInfo.location} />
              <InfoCard label={about.basicInfo.languagesLabel} value={about.basicInfo.languages} />
              <InfoCard label={about.basicInfo.statusLabel} value={about.basicInfo.status} />
            </div>
          )}

          {activeTab === "skills" && <SkillsGrid />}

          {activeTab === "education" && (
            <div className="max-w-xl mx-auto">
              {about.education.items.map((edu, i) => (
                <div key={i} className="p-6 rounded-xl bg-white border border-steel-dark shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold text-text-primary">{edu.school}</h4>
                  <p className="text-text-secondary">{edu.degree}</p>
                  <p className="text-accent-shadow">{edu.year}</p>
                  <p className="text-text-body">{edu.gpa}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-4">
              {about.certificates.items.map((group, i) => (
                <details key={i} className="group">
                  <summary
                    className="
                    flex justify-between items-center cursor-pointer
                    p-4 rounded-lg bg-white border border-steel-dark
                    hover:border-text-primary/40 hover:shadow-sm transition-all
                  "
                  >
                    <span className="text-text-primary font-medium">{group.name}</span>
                    <span className="text-accent-shadow">{group.count} certificates</span>
                  </summary>
                  <div className="mt-2 pl-4 space-y-2">
                    {group.items.map((cert, j) => (
                      <div
                        key={j}
                        className="p-3 rounded-lg bg-bg-secondary/30 border border-steel-dark"
                      >
                        <p className="text-text-secondary text-sm">{cert.name}</p>
                        <p className="text-accent-shadow text-xs">{cert.provider}</p>
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
    <div className="p-6 rounded-xl bg-white border border-steel-dark shadow-sm hover:shadow-md transition-shadow text-center">
      <p className="text-sm text-accent-shadow mb-1">{label}</p>
      <p className="text-lg text-text-primary">{value}</p>
    </div>
  );
}
