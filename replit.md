# replit.md

## Overview

This is an **AI Career Roadmap Generator** — a full-stack web application that helps users navigate career paths in Artificial Intelligence. Users can take skill assessments, explore AI career paths, and generate personalized learning roadmaps powered by OpenAI. The app creates structured roadmaps with skills, resources, and progress tracking.

Key features:
- AI-powered roadmap generation (via OpenAI) based on user's role, goal, and skill level
- Career path explorer with pre-seeded AI career data
- Skill assessment quiz that recommends career paths
- Progress tracking for skills within roadmaps (pending → in-progress → completed)
- Resource library with curated learning materials per skill
- Chat/conversation system (Replit AI Integrations)
- Authentication via Replit Auth (OpenID Connect)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state; no global client state library
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (dark theme by default — deep space aesthetic with neon accents)
- **Animations**: Framer Motion for page transitions and UI animations
- **Fonts**: 'Outfit' (display/headings) and 'DM Sans' (body text)
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

Pages:
- `LandingPage` — public marketing page
- `Dashboard` — authenticated user's roadmap list
- `GenerateRoadmap` — form to create AI-generated roadmap
- `RoadmapDetail` — view skills + resources with progress tracking
- `CareerExplorer` — browse pre-seeded career paths
- `Assessment` — multi-step quiz for career recommendations
- `CareerResults` — shows recommended careers based on assessment
- `Resources` — aggregated learning resources from roadmaps

### Backend (server/)
- **Framework**: Express.js on Node.js with TypeScript
- **Runtime**: tsx for development, esbuild for production builds
- **API Pattern**: REST API under `/api/` prefix; route definitions shared between client and server via `shared/routes.ts`
- **Input Validation**: Zod schemas defined in shared routes and schema files
- **AI Integration**: OpenAI SDK (configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables)
- **HTTP Server**: Node `http.createServer` wrapping Express (supports WebSocket upgrades if needed)

### Shared Code (shared/)
- `schema.ts` — Drizzle ORM table definitions and Zod insert schemas (re-exports from `models/`)
- `routes.ts` — API route contracts with path, method, input validation, and response schemas
- `models/auth.ts` — User and session tables (required for Replit Auth)
- `models/chat.ts` — Conversation and message tables for chat feature

### Database
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-orm/node-postgres` driver
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Session Store**: `connect-pg-simple` storing sessions in the `sessions` table
- **Schema location**: `shared/schema.ts` (single source of truth)

Database tables:
- `users` — user profiles (Replit Auth managed)
- `sessions` — express session storage (Replit Auth managed)
- `career_paths` — pre-seeded career path data (title, description, salary, demand level)
- `roadmaps` — user-generated roadmaps (linked to user by `userId`)
- `skills` — skills within a roadmap (ordered, with status tracking)
- `resources` — learning resources linked to skills (url, type)
- `conversations` — chat conversations
- `messages` — chat messages within conversations

### Authentication
- **Method**: Replit Auth via OpenID Connect (OIDC)
- **Implementation**: Passport.js with `openid-client` strategy
- **Session**: Express sessions stored in PostgreSQL via `connect-pg-simple`
- **Required env vars**: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`, `DATABASE_URL`
- **Key files**: `server/replit_integrations/auth/` directory
- **User identity**: `req.user.claims.sub` provides the user ID

### Replit Integrations (server/replit_integrations/)
Pre-built modules for common features:
- `auth/` — Replit Auth setup, routes, and storage
- `chat/` — Conversation CRUD and OpenAI-powered chat with SSE streaming
- `audio/` — Voice chat with speech-to-text, text-to-speech, and audio streaming
- `image/` — Image generation via `gpt-image-1`
- `batch/` — Batch processing utilities with rate limiting and retries

### Build System
- **Development**: `npm run dev` — runs tsx with Vite dev server middleware (HMR enabled)
- **Production build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Production start**: `npm run start` — runs the bundled server which serves static files
- **Type checking**: `npm run check` — TypeScript compiler check
- **Database sync**: `npm run db:push` — pushes schema to database

## External Dependencies

### Required Services
- **PostgreSQL Database** — connected via `DATABASE_URL` environment variable. All tables are defined in Drizzle schema and pushed with `db:push`.
- **OpenAI API** — used for roadmap generation and chat features. Configured via:
  - `AI_INTEGRATIONS_OPENAI_API_KEY` — API key
  - `AI_INTEGRATIONS_OPENAI_BASE_URL` — Base URL (Replit AI Integrations proxy)

### Required Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for express-session
- `REPL_ID` — Replit deployment ID (auto-set by Replit)
- `ISSUER_URL` — OIDC issuer URL (defaults to `https://replit.com/oidc`)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI API base URL

### Key NPM Packages
- **Frontend**: React, wouter, @tanstack/react-query, framer-motion, shadcn/ui (Radix UI), react-hook-form, zod, date-fns, recharts, embla-carousel-react
- **Backend**: Express, passport, openid-client, express-session, connect-pg-simple, drizzle-orm, pg, openai, zod
- **Build**: Vite, esbuild, tsx, drizzle-kit