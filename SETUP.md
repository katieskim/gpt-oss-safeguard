# Influencer Content Classifier - Setup Guide

## Project Overview

A comprehensive landing page and UI system for the Influencer Content Classifier tool. This internal tool provides an MPAA-style content classification system (I-G through I-NC17) for evaluating influencers based on content maturity.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (component library)
- **Radix UI** (for complex components)
- **lucide-react** (icon library)

## Project Structure

```
gpt-oss-safeguard/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── tabs.tsx
│   │   └── accordion.tsx
│   ├── hero-classifier.tsx         # Hero section
│   ├── problem-context.tsx         # Problem & context section
│   ├── rating-overview.tsx         # Rating system overview
│   ├── rating-guidelines.tsx       # Detailed guidelines with tabs
│   ├── agent-playground.tsx        # AI classifier playground
│   ├── example-use-cases.tsx       # Example classifications
│   ├── governance-section.tsx      # Governance & safety info
│   └── faq-section.tsx            # FAQ with accordion
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── content.md             # Original classification guidelines
└── package.json

```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Page Sections

The landing page includes the following sections in order:

1. **Hero Section** - Introduction with CTA buttons and sample classification card
2. **Problem & Context** - Why content classification matters (3 risk cards)
3. **Rating System Overview** - High-level overview of 5 rating categories
4. **Detailed Classification Guidelines** - Full criteria with tabs for each rating
5. **Classifying Agent Playground** - Interactive AI classifier demo
6. **Example Use Cases** - 5 example influencer profiles with classifications
7. **Governance & Safety** - Workflow and review process
8. **FAQ Section** - Common questions with accordion

## Component System

All UI components are located in `/components/ui` following shadcn/ui conventions:

- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Consistent card containers with header/content sections
- **Badge** - Rating labels with color-coded variants
- **Input/Textarea** - Form inputs for the playground
- **Tabs** - For detailed guidelines navigation
- **Accordion** - For FAQ section

## Design System

### Color Palette

- **Background**: Dark slate (slate-950)
- **Cards**: slate-900/50 with slate-800 borders
- **Text**: slate-100 (primary), slate-400 (secondary)

### Rating Colors

- **I-G**: Emerald 500 (green)
- **I-PG**: Sky 500 (blue)
- **I-PG13**: Amber 500 (yellow)
- **I-R**: Orange 500
- **I-NC17**: Red 700

### Typography

- **Hero**: text-4xl to text-6xl, font-semibold
- **Section Headings**: text-2xl to text-3xl, font-semibold
- **Body**: text-sm to text-base, text-slate-400

## Responsive Design

The layout is fully responsive:

- **Mobile** (320px+): Stacked vertical layout
- **Tablet** (768px+): 2-column grids where appropriate
- **Desktop** (1024px+): Full multi-column layouts

All sections use max-width containers (max-w-6xl) with responsive padding.

## Key Features

### 1. Agent Playground

Located in `components/agent-playground.tsx`:

- Input form for influencer profile descriptions
- Mock AI classification logic based on keywords
- Real-time loading states
- Displays rating, summary, key factors, and raw JSON output
- Fully client-side interactive

### 2. Rating Guidelines Tabs

Located in `components/rating-guidelines.tsx`:

- Interactive tabs for each rating (I-G through I-NC17)
- Displays definition, criteria, and example content types
- Consistent visual treatment across all ratings

### 3. Example Use Cases

Located in `components/example-use-cases.tsx`:

- 5 pre-defined example profiles
- Expandable detailed analysis
- Demonstrates real-world application of the system

## CSS Variables

Custom CSS variables are defined in `app/globals.css`:

```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--radius
```

## Future Enhancements

To connect a real AI backend:

1. Create API route at `app/api/classify/route.ts`
2. Update `agent-playground.tsx` to call the API
3. Replace mock classification logic with real LLM integration
4. Add authentication/authorization as needed
5. Implement logging and audit trail

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ JavaScript features
- CSS Grid and Flexbox

## Notes

- All components are TypeScript-based for type safety
- Uses Next.js App Router (not Pages Router)
- Dark mode ready (uses `darkMode: "class"` in Tailwind config)
- All icons from lucide-react for consistency
- Fully accessible with semantic HTML

## License

ISC
