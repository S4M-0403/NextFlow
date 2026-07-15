# NextFlow

> A full-stack AI workflow builder that enables users to visually design, execute, and persist AI-powered workflows using drag-and-drop nodes.

![Workflow Builder](./assets/workflow.jpeg)

## 🔗 Links

- **Live Demo:** https://galaxy-ai-murex.vercel.app
- **GitHub Repository:** https://github.com/S4M-0403/GalaxyAI

## Hero

NextFlow is a full-stack AI workflow builder that allows users to create visual workflows using drag-and-drop nodes, execute AI-powered tasks, and persist workflows across sessions and devices.

## Features
✅ Visual drag-and-drop workflow editor

✅ Gemini AI integration

✅ Image Crop node using Transloadit

✅ Clerk Authentication

✅ PostgreSQL persistence with Prisma

✅ Execution history

✅ Cross-device workflow synchronization

✅ Responsive interface

✅ Locked template nodes

✅ Vercel deployment

## Screenshots

### Dashboard

![Dashboard](./assets/dashboard.jpeg)

### Workflow Builder

![Workflow Builder](./assets/workflow.jpeg)


### Execution History

![History](./assets/history.jpeg)

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript
- State: Zustand
- Graph UI: React Flow
- Styling: TailwindCSS
- Backend: Next.js API routes
- ORM: Prisma
- Database: PostgreSQL (e.g., Neon)
- Auth: Clerk
- AI: Gemini API
- File/Image processing: Transloadit
- Deployment: Vercel

## Architecture Overview

Frontend

- Built with Next.js App Router and React components. UI state is handled with Zustand. The visual graph editor is implemented with React Flow and custom node components.

Backend

- Next.js API routes serve the execution API and webhook endpoints. Prisma provides a typed database layer to persist workflows, nodes, runs, and user metadata in PostgreSQL.

Authentication

- Clerk provides user and session management, protecting API routes and enabling per-user workspace isolation.

AI Services

- Gemini is used for LLM-driven nodes; nodes that require image processing rely on Transloadit for reliable, scalable processing.

Deployment

- App and serverless API routes are designed to deploy to Vercel with environment-backed secrets and persistent Postgres hosted by Neon or similar.

## Folder Structure

Top-level folders and important modules:

```
app/                # Next.js App Router, pages and API surface
  layout.tsx
  page.tsx
  api/              # server routes: gemini, transloadit, workflows
assets/             # image placeholders and static assets
components/         # UI components and node definitions
lib/                # app libraries: prisma, executors, ai integrations
  prisma.ts
  gemini/
  execution/
prisma/             # Prisma schema
stores/             # client-side stores (Zustand)
next.config.ts
package.json
README.md
```

## Getting Started

Install dependencies:

```bash
npm install
```

Development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run production build locally (optional):

```bash
npm start
```

## Environment Variables

Create a `.env` file in the project root and populate the entries below. 

| Variable                            | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string used by Prisma (e.g., Neon) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for client SDK                     |
| `CLERK_SECRET_KEY`                  | Clerk secret key for server-side verification            |
| `GEMINI_API_KEY`                    | API key for Gemini or other LLM provider                 |
| `TRANSLOADIT_AUTH_KEY`              | Transloadit authentication key for image processing      |

Example `.env` (DO NOT USE REAL VALUES):

```
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
GEMINI_API_KEY="gemini_key_here"
TRANSLOADIT_AUTH_KEY="transloadit_key_here"
```

## Running Locally

1. Install dependencies: `npm install`
2. Create and populate `.env` with the required secrets
3. Run database migrations:

```bash
npx prisma migrate dev --name init
```

4. Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000` and sign in via Clerk to create and manage workflows.

## Workflow Overview

Workflows are graph-based documents composed of nodes. Each node encapsulates a unit of work (e.g., call Gemini, crop an image, send an HTTP request). The editor uses React Flow for layout and node connections. When a workflow executes, the engine resolves node dependencies (DAG), schedules node execution, routes outputs to connected inputs, and persists run metadata into the database.

Key runtime behaviors:

- DAG resolution and topological execution ordering
- Node-level retries and error propagation
- Execution instrumentation and per-run logs
- Persistent storage for workflows and historical runs

User
   │
   ▼
Next.js UI
   │
React Flow
   │
Zustand
   │
API Routes
   │
──────────────
│ Prisma
│ Clerk
│ Gemini
│ Transloadit
──────────────
   │
PostgreSQL

## Technical Challenges

- Migrated workflow persistence from localStorage to PostgreSQL using Prisma while preserving existing functionality.

- Designed a persistence layer that synchronizes workflows and execution history across browser sessions and devices.

- Integrated multiple third-party services including Gemini, Clerk, Neon, and Transloadit into a single workflow execution pipeline.

- Debugged Prisma client generation, schema migrations, and production deployment issues during Vercel deployment.

- Built reusable workflow nodes with a common execution interface to simplify future node additions.

## Future Improvements

- Expand node library with specialized AI primitives (summarizers, extractors, multimodal nodes)
- Real-time collaborative editing and presence indicators
- Workflow sharing, templates, and marketplace for node packs
- Versioned workflow history and rollbacks
- Scheduling, triggers, and cron-like orchestration
- Fine-grained RBAC and organizational multi-tenancy
- Observability: metrics, tracing, and long-term run retention

## Demo

A hosted demo is recommended for evaluation. For a quick local demo, seed the database with the sample workflow in `lib/workflow/demo-workflow.json` then sign in and open the Workflow Builder.

## License

This repository is released under the MIT License. See the `LICENSE` file for details.

---