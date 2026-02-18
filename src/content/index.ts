import { about } from "@/content/site/about";
import { contact, social } from "@/content/site/contact";
import { hero } from "@/content/site/hero";
import { projects, showcaseItems } from "@/content/site/projects";
import type { PortfolioContent } from "@/content/types";

export const content: PortfolioContent = {
  hero,
  about,
  projects,
  showcase: { items: showcaseItems },
  contact,
  social,
};

export type * from "@/content/types";
