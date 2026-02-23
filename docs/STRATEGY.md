# System Overview

## Architecture

This is a **JSON-configurable health report viewer** built with React 19 + TypeScript + Tailwind v4. The entire report is driven by a single JSON file — swap the JSON, get a new report.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 6.2 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| UI Primitives | Headless UI |
| AI Extraction | Google Gemini via @google/genai |

## Data Flow

```
HTML Report (Owner.com) → Gemini Extraction Script → JSON → React App
```

1. Capture HTML from grader.owner.com
2. Run `npx tsx src/lib/extract-report.ts <file.html>` to generate JSON
3. Import JSON in App.tsx → renders full report

## File Structure

```
src/
├── App.tsx                    # Root component, imports JSON
├── data/                      # JSON report files
│   └── feast-buffet.json
├── types/report.ts            # TypeScript interfaces
├── lib/
│   ├── score-utils.ts         # Score calculation utilities
│   └── extract-report.ts      # Gemini extraction script
├── components/
│   ├── shared/                # Reusable components
│   ├── layout/                # Layout shell
│   ├── scorecard/             # Sidebar score card
│   ├── search-results/        # Section 1
│   ├── website-experience/    # Section 2
│   ├── local-listings/        # Section 3
│   └── ai-website/            # AI improvement promo
├── assets/
│   ├── icons/                 # SVG icons
│   ├── images/                # Photos and screenshots
│   └── fonts/                 # SuisseIntl fonts (optional)
└── styles/
    ├── fonts.css              # @font-face declarations
    └── animations.css         # Keyframe animations
```

## Design Principles

- **Data-driven**: All content comes from JSON, no hardcoded strings
- **Component isolation**: Each section is self-contained
- **Responsive**: Mobile-first with sidebar on desktop
- **Accessible**: Headless UI for proper ARIA handling
- **Performant**: Animations via Motion, lazy loading where possible
