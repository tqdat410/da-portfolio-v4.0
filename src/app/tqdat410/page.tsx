import type { Metadata } from "next";
import { FinderLaunchpad } from "@/components/finder/finder-launchpad";

export const metadata: Metadata = {
  title: "tqdat410",
  description: "Finder-style gateway for portfolio, projects, and certificates.",
};

export default function Tqdat410Page() {
  return <FinderLaunchpad />;
}
