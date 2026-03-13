# TCC - Tech Career Coach

TCC is a static, browser-only MVP that helps recent graduates and early-career professionals with business or non-technical backgrounds identify which business-side tech roles best fit their current signals.

The app is intentionally deterministic. It uses a 24-question quiz, normalized dimension scoring, weighted role scoring, and guarded recommendation logic for roles that are commonly over-recommended without enough evidence.

## Stack

- React 18
- TypeScript
- Vite
- React Router with `HashRouter`
- Vanilla CSS
- Vitest

## What the app includes

- Landing page
- Quiz with local progress resume and reset
- Results page with best-fit roles, stretch roles, full ranking, dimension profile, gap analysis, career path guide, and AI prompt generator
- Role library
- Methodology page
- Pure TypeScript scoring engine
- GitHub Pages deployment workflow

## Setup

```bash
pnpm install
```

## Local development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## Deploy

This repo is configured for GitHub Pages via GitHub Actions.

1. Push the repository to GitHub.
2. Enable GitHub Pages and set the source to GitHub Actions.
3. Push to `main` and the workflow will build and deploy the static site.

Because the app uses `HashRouter` and Vite's relative asset base, it works cleanly on GitHub Pages without a backend rewrite layer.
