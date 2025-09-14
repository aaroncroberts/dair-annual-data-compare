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

## Commit Messages

Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This creates a consistent and readable commit history.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

The type must be one of the following:

-   **feat**: A new feature
-   **fix**: A bug fix
-   **docs**: Documentation only changes
-   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   **refactor**: A code change that neither fixes a bug nor adds a feature
-   **perf**: A code change that improves performance
-   **test**: Adding missing tests or correcting existing tests
-   **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
-   **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
-   **chore**: Other changes that don't modify `src` or `test` files
-   **revert**: Reverts a previous commit

### Scope

The scope is optional and can be anything specifying the place of the commit change. For example `(page)`, `(component)`, `(styles)`.

### Subject

The subject contains a succinct description of the change:

-   Use the imperative, present tense: "change" not "changed" nor "changes"
-   Don't capitalize the first letter
-   No dot (.) at the end

### Body

The body is optional. Use it to explain what and why vs. how.

### Footer

The footer is optional. It should contain information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.