# DaPortfolio v4.0

Portfolio website built with Next.js App Router.

## Active Routes

- `/` - main portfolio page
- `/tqdat410` - desktop-style launcher
- `/tqdat410/projects` - markdown project explorer
- `/tqdat410/certificates` - certificates explorer

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Jest + Testing Library

## Content Model

- `src/content/site/*` stores homepage content (hero/about/showcase/contact/social)
- `src/content/projects/*.md` stores project documentation and image mappings
- `src/content/certificates/certificates.md` stores certificate index and category files
- `src/content/projects/config.ts` stores project category order
- `src/content/certificates/config.ts` stores certificate category order

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run format:check
```

## Project Structure

```text
src/
  app/
  components/
  content/
    site/
    projects/
    certificates/
  hooks/
  lib/
```
