# ClinicTech

**Live site: https://anish-mehta76.github.io/clinictech-site/**

A tech partner for small clinics: websites, language access, and insurance and benefits help. Our work is free for clinics.

## Pages

| Page | Live link |
|---|---|
| Home | https://anish-mehta76.github.io/clinictech-site/ |
| Roadmap storyboard | https://anish-mehta76.github.io/clinictech-site/roadmap/ |
| Services | https://anish-mehta76.github.io/clinictech-site/services/ |
| Our Work | https://anish-mehta76.github.io/clinictech-site/work/ |
| About | https://anish-mehta76.github.io/clinictech-site/about/ |
| FAQ | https://anish-mehta76.github.io/clinictech-site/faq/ |
| Request a Project | https://anish-mehta76.github.io/clinictech-site/request/ |

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploys

Every push to `main` builds a static export and publishes it to GitHub Pages (`.github/workflows/pages.yml`).

The request form sends to Formspree. Set the form ID as the Actions variable `NEXT_PUBLIC_FORMSPREE_ID` (Settings → Secrets and variables → Actions → Variables), or in `.env.local` for local runs. See `.env.example`.

## Stack

Next.js 15 (App Router, static export), React 19, Tailwind CSS v4, GSAP + Lenis on the roadmap page, lucide-react icons.
