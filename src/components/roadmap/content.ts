// Storyboard content. Source of truth for copy: docs/roadmap-content.md.

export type StageId = "find" | "book" | "checkin" | "visit" | "coverage" | "followup";

export type Stage = {
  id: StageId;
  name: string;
  headline: string;
  line: string;
  pains: string[];
  fix: string;
  service: string;
  setup: string;
  note: string;
  /** Point on the map, in SVG units (viewBox 0 0 1600 1000). */
  at: [number, number];
};

export const STAGES: Stage[] = [
  {
    id: "find",
    name: "Find",
    headline: "Most patients start on a phone.",
    line: "Someone needs care and searches for a clinic nearby.",
    pains: ["No site, or one that's years out of date", "Hours and location are hard to find", "The phone rings for basic questions"],
    fix: "A mobile-first site that answers first",
    service: "Websites",
    setup: "Live in a few weeks",
    note: "Search, then call — or move on",
    at: [250, 330],
  },
  {
    id: "book",
    name: "Book",
    headline: "Then they try to get in.",
    line: "Booking is often a phone call during office hours.",
    pains: ["Phone-only booking", "Voicemail tag after hours", "Details written down twice"],
    fix: "Online appointment requests",
    service: "Websites",
    setup: "Part of the website build",
    note: "After 5pm, the line is closed",
    at: [560, 220],
  },
  {
    id: "checkin",
    name: "Check in",
    headline: "Forms, in one language.",
    line: "At the front desk, paperwork meets a language barrier.",
    pains: ["Intake forms only in English", "Staff re-explain the same things", "Waiting on an interpreter"],
    fix: "Translated forms, with AI support for interpreters",
    service: "Language access",
    setup: "Varies with scope",
    note: "The form is the first conversation",
    at: [880, 370],
  },
  {
    id: "visit",
    name: "Visit",
    headline: "Understanding is part of care.",
    line: "In the exam room, every word matters.",
    pains: ["Language gaps between patient and provider", "Interpreters aren't always available", "Patients nod along without understanding"],
    fix: "AI translation as support for qualified interpreters, not a replacement",
    service: "Language access",
    setup: "Varies with scope",
    note: "Interpreters lead; tools help",
    at: [1200, 250],
  },
  {
    id: "coverage",
    name: "Coverage",
    headline: "“Do you take my insurance?”",
    line: "Coverage questions land on the front desk all day.",
    pains: ["The same eligibility calls, over and over", "Look-ups done by hand", "Surprise bills that erode trust"],
    fix: "Plain-language coverage pages and a staff benefits checker",
    service: "Insurance & benefits",
    setup: "Varies with scope",
    note: "One question, many phone calls",
    at: [1420, 590],
  },
  {
    id: "followup",
    name: "Follow-up",
    headline: "Going home with instructions.",
    line: "Care continues after the visit, if the patient can read it.",
    pains: ["Discharge instructions only in English", "Reminders patients can't read", "Avoidable return calls"],
    fix: "Translated discharge instructions and texts",
    service: "Language access",
    setup: "Varies with scope",
    note: "The last page decides the next visit",
    at: [1040, 810],
  },
];

export const START: [number, number] = [70, 560];
export const HOME: [number, number] = [620, 780];

export type Workflow = { id: string; label: string; before: string[]; after: string[] };

// Illustrative placeholders until we have real counts from the pilot clinic.
export const WORKFLOWS: Workflow[] = [
  {
    id: "booking",
    label: "Booking a new patient",
    before: ["Patient calls", "On hold", "Voicemail", "Staff calls back", "Details by phone", "Written into schedule"],
    after: ["Request online", "Staff confirms"],
  },
  {
    id: "checkin",
    label: "Check-in, Spanish speaker",
    before: ["English form", "Patient waits", "Find bilingual staff", "Re-explain", "Fill in for them"],
    after: ["Translated form", "Interpreter where needed"],
  },
  {
    id: "coverage",
    label: "“Do you take my plan?”",
    before: ["Patient calls", "Look up plan", "Check payer portal", "Call patient back"],
    after: ["Patient reads coverage page"],
  },
];

export const CHECKLIST = [
  "Hours and directions answered online",
  "After-hours booking requests captured",
  "Intake forms ready in your patients' languages",
  "Common coverage questions answered in plain language",
  "Discharge instructions translated",
];

export const FACTS = [
  { value: 6, suffix: "", label: "stops on the patient path", note: "Find, book, check in, visit, coverage, follow-up." },
  { value: 3, suffix: "", label: "services that fill the gaps", note: "Websites, language access, insurance help." },
  { value: 2, suffix: " days", label: "to hear back from us", note: "Business days, after you send a request." },
  { value: 0, suffix: "", label: "patient details on our forms", note: "We never ask for patient information." },
];

export type SceneKey = { x: number; y: number; s: number };

/** Scene list drives the rail, the camera and the ids. Stage scenes are generated from STAGES. */
export const SCENES: { id: string; label: string; cam: SceneKey }[] = [
  { id: "cover", label: "Begin", cam: { x: 760, y: 520, s: 0.74 } },
  ...STAGES.map((st) => ({ id: st.id, label: st.name, cam: { x: st.at[0], y: st.at[1] + 10, s: 2 } })),
  { id: "fit", label: "Where we fit", cam: { x: 820, y: 480, s: 1.1 } },
  { id: "with", label: "With us", cam: { x: 760, y: 510, s: 0.8 } },
  { id: "untangle", label: "Before & after", cam: { x: 760, y: 470, s: 1.35 } },
  { id: "time", label: "Time back", cam: { x: 1060, y: 760, s: 1.6 } },
  { id: "impact", label: "Impact", cam: { x: 760, y: 520, s: 0.74 } },
  { id: "cta", label: "Start", cam: { x: HOME[0], y: HOME[1] - 30, s: 1.9 } },
];
