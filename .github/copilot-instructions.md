# GitHub Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to this project.

## Project Overview

This is a Next.js application that serves as a single-page infographic for a financial analysis automation initiative. It's designed to be a visually appealing and interactive presentation of the project's goals and timeline.

## Project Goals

The primary goal of this project is to automate financial reporting and deliver three core benefits:

1.  **Process Optimization**: Simplify the financial reporting process, provide faster insights, and create a consistent delivery mechanism.
2.  **Shared Definitions**: Establish a single source of truth for financial terminology and business logic, eliminating ambiguity and ensuring all stakeholders are aligned.
3.  **Organizational Insights**: Empower leadership with clear, consistent, and transparent financial insights through automated data visualization, enabling faster and more informed decision-making.

- **Framework:** [Next.js](https://nextjs.org/) with the App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI:** [React](https://reactjs.org/) (Client-side rendered)

## Architecture

The application consists of a single page, `app/page.tsx`, which is a client component (`"use client";`). This is the primary entry point and contains all the UI logic.

### Data Flow

The page's content is sourced from static JSON files located in the `public/` directory:

- `public/executive-summary.json`: Contains the text for the "Executive Summary" section's tabs.
- `public/project-plan.json`: Contains the data for the project timeline phases.

When making changes to the content, you should edit these JSON files. The `app/page.tsx` component is responsible for importing this data and rendering it.

```typescript
// in app/page.tsx
import summaryContentData from '@/public/executive-summary.json';
import projectPhasesData from '@/public/project-plan.json';
```

## Developer Workflow

### Getting Started

To run the development server, use the following command:

```bash
npm run dev
```

This will start the server with Turbopack for faster development.

### Building for Production

To create a production build, run:

```bash
npm run build
```

This also uses Turbopack.

### Linting

To check for code quality and style issues, run:

```bash
npm run lint
```

## Conventions

### Styling

- All styling is done using Tailwind CSS utility classes directly in the JSX of `app/page.tsx`.
- The primary brand color is `#008A54`.
- The application uses the 'Inter' font, loaded via Google Fonts in `app/page.tsx`.

### Interactivity

- The page uses React hooks (`useState`, `useEffect`) to manage state for UI interactions like:
  - Scroll-triggered animations
  - Tabbed content in the "Executive Summary" section
  - Expandable/collapsible items in the "Project Plan" timeline.
- Animations are triggered by adding the `animate-on-scroll` class to elements and using an `IntersectionObserver`.

### File Structure

- `app/page.tsx`: The main and only page component.
- `app/globals.css`: Global styles (minimal, as Tailwind is primary).
- `public/`: Contains static assets, including the JSON data files.
- `next.config.ts`: Next.js configuration.
- `package.json`: Project scripts and dependencies.