import type { Metadata } from "next";
import { Storyboard } from "@/components/roadmap/Storyboard";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Follow one patient through a small clinic: six stops, the gaps, and where ClinicTech fits.",
};

export default function RoadmapPage() {
  return <Storyboard />;
}
