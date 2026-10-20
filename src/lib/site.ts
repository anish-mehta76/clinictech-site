export const SITE_NAME = "ClinicTech";
export const PITCH = "We come to your clinic, learn how the day actually runs, and build tailored programs — websites, language access and insurance help — that take the friction out of it.";
export const CONTACT_EMAIL = "hello@example.com";

export const NAV = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export const SERVICES = [
  {
    id: "websites",
    title: "Clinic websites",
    short: "A clean, mobile-friendly site with booking and contact info.",
    problem: "Patients search on their phones. An outdated or missing site sends them to the clinic down the street.",
    build: ["Mobile-first site with your services, hours and location", "Online booking or a clear call/booking button", "Pages in your patients' languages"],
    gets: "A site you can be proud of, live in weeks, that's easy to keep up to date.",
  },
  {
    id: "translation",
    title: "AI translation & language access",
    short: "Help at the front desk and exam room, plus translated forms and texts.",
    problem: "Many patients speak a language your staff doesn't. Forms, discharge instructions and reminders get lost in translation.",
    build: ["Live translation support at the front desk and in the exam room", "Translated intake forms, discharge instructions and texts", "Workflows that support — not replace — qualified interpreters"],
    gets: "Patients who understand their care, and staff who spend less time stuck on language barriers.",
  },
  {
    id: "insurance",
    title: "Insurance & benefits help",
    short: "Guides, FAQs and simple tools that make coverage understandable.",
    problem: "Patients don't know what their plan covers, and staff field the same eligibility questions all day.",
    build: ["Plain-language coverage guides and FAQ pages", "Simple eligibility and benefits checkers for staff", "Patient-facing explainers for common plans you accept"],
    gets: "Fewer confused calls, fewer surprise bills, and a front desk with time back.",
  },
];

// Trust chips: only things that are true today.
export const TRUST = ["Concepts + pilots, clearly labeled", "No patient data on our forms", "Plain language", "Student-founded"];

export const STEPS = [
  { title: "Tell us about your clinic", body: "Fill out a short request form. No patient information, ever. We reply within two business days." },
  { title: "We plan it together", body: "We talk through what you need and give you a scope and timeline up front." },
  { title: "We build, you review", body: "We share drafts as we go. A contact person at your clinic reviews before anything goes live." },
];

export type WorkLabel = "Concept" | "Pilot" | "Case study";

export const WORK: { label: WorkLabel; title: string; body: string; status: string }[] = [
  { label: "Concept", title: "Riverside Family Medicine", body: "A concept site for a made-up primary care clinic: bilingual pages, online booking and a clear new-patient guide.", status: "Made-up clinic, design sample" },
  { label: "Concept", title: "Sunrise Pediatric Dental", body: "A concept site for a made-up pediatric dental office: friendly design, insurance FAQ and appointment requests.", status: "Made-up clinic, design sample" },
  { label: "Pilot", title: "Partner clinic pilot", body: "Our first real project, in progress with a local clinic. Case study coming soon.", status: "In progress" },
  { label: "Case study", title: "Language Access", body: "Our translator club's volunteer work: patients helped, languages covered and hours volunteered. Numbers coming soon.", status: "Numbers coming soon" },
];

export const FAQ_GROUPS = [
  {
    group: "Cost & timeline",
    items: [
      { q: "Does it cost anything?", a: "No. Our work is free for clinics." },
      { q: "How long does a project take?", a: "A clinic website typically takes a few weeks from kickoff to launch. Translation and insurance tools vary with scope — we'll give you a timeline up front." },
    ],
  },
  {
    group: "Privacy",
    items: [
      { q: "What about privacy and HIPAA?", a: "Websites are low-risk and don't handle patient records. Any tool that touches patient conversations or data uses HIPAA-compliant vendors who will sign a Business Associate Agreement. Our request form never asks for patient information." },
    ],
  },
  {
    group: "Languages",
    items: [
      { q: "Does AI translation replace interpreters?", a: "No. For clinical conversations we position AI translation as support for qualified interpreters, not a replacement." },
    ],
  },
  {
    group: "Getting started",
    items: [
      { q: "What do you need from our clinic?", a: "Your logo and photos if you have them, your services, hours and locations, the languages your patients speak, and a contact person who can review drafts." },
    ],
  },
];
