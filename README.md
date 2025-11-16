# Influencer Content Classifier

A comprehensive landing page and UI system for an internal tool that provides MPAA-style content classification for influencer screening and risk assessment.

## Overview

This project implements a visual and interactive system for classifying influencer content across five maturity ratings:

- **I-G** - General Audience (family-friendly)
- **I-PG** - Parental Guidance (mildly mature)
- **I-PG13** - Parents Strongly Cautioned (moderately mature)
- **I-R** - Restricted (strong mature themes)
- **I-NC17** - Adults Only (explicit content)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

## Features

- **Hero Section** with interactive sample classification
- **Problem & Context** explaining the need for content classification
- **Rating System Overview** with color-coded badges
- **Detailed Guidelines** with interactive tabs for each rating
- **AI Classifier Playground** for testing classifications
- **Example Use Cases** with real-world scenarios
- **Governance Workflow** showing human-in-the-loop process
- **FAQ Section** with common questions and edge cases

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives
- lucide-react icons

## Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions, component documentation, and architecture overview.

See [content.md](./content.md) for the complete classification guidelines that power the system.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   └── *.tsx              # Page section components
├── lib/                   # Utilities
└── content.md             # Classification guidelines
```

## License

ISC
