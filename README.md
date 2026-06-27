# NextFlow

A visual AI workflow builder inspired by no-code automation platforms. Users create workflows by connecting nodes on a canvas, execute nodes individually or run the full directed acyclic graph (DAG), and inspect execution history.

## Features

Implemented Features:

- Request Inputs node
  - Dynamic text inputs
  - Dynamic image inputs
  - User-entered values propagate through workflow execution

- Gemini 3.1 Pro node
  - Prompt input
  - System prompt input
  - Gemini API integration
  - Text generation output
  - Connected inputs override manual fields

- Crop Image node
  - Accepts image inputs
  - Configurable crop parameters (X, Y, Width, Height)
  - Image workflow support

- Response node
  - Displays workflow output

- Workflow Engine
  - DAG execution
  - Parallel execution of independent branches
  - Fan-out support
  - Single node execution
  - Multi-node execution
  - Full workflow execution

- Validation
  - Type-safe connections
  - DAG-only graph validation
  - Cycle prevention
  - Connection compatibility checking

- Canvas Features
  - Zoom
  - Pan
  - MiniMap
  - Animated edges
  - Grid background

- Workflow Management
  - Undo / Redo
  - Import workflow JSON
  - Export workflow JSON
  - Run history tracking
  - Local persistence

- Authentication
  - Clerk authentication
  - Protected dashboard routes

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Zustand
- React Flow (@xyflow/react)
- Clerk
- Google Gemini API
- Tailwind CSS

## Architecture

Brief overview:

- Nodes: Units of computation or I/O (Request Inputs, Gemini, Crop Image, Response). Each node defines inputs, outputs, and execution behavior.
- Handles: Node connection points used to route typed data between nodes; the connection layer enforces compatibility and directionality.
- Executors: Small runtime adapters that run node logic (e.g., calling the Gemini API, performing crop parameter propagation) and return typed outputs.
- Workflow execution engine: Orchestrates DAG traversal, schedules parallel branches, supports single-node and multi-node runs, and collects run traces for history.
- Connection validation layer: Validates graph topology (DAG-only), prevents cycles, and enforces type compatibility before execution.
- Zustand store: Central client-side state for the canvas, nodes, connections, and run history with local persistence.

## Project Structure

Top-level folders and purpose:

```
app/
components/
hooks/
lib/
stores/
prisma/
public/
```

- `app/`: Next.js app routes, pages, layouts, and API route handlers.
- `components/`: Reusable React UI components (canvas, node renderers, dashboard pieces).
- `hooks/`: Custom React hooks (for workflows, connected state, and effects).
- `lib/`: Core libraries such as the workflow engine, executors, node catalog, validation, and utility helpers.
- `stores/`: Zustand stores for application state (workflow store, UI state, run history).
- `prisma/`: Prisma schema for planned database persistence (not yet integrated).
- `public/`: Static assets used by the app.

## Running Locally

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` at project root and add required variables:

```
GEMINI_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

3. Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000` to view the app.

## Current Limitations

- Crop node currently focuses on workflow behavior and parameter propagation (real image processing pipeline is not implemented).
- Workflow persistence currently uses local storage for convenience and portability.
- PostgreSQL/Prisma persistence is planned but not yet integrated.

## Demo Workflow

Example flows included in the demo:

- Request Inputs → Gemini → Gemini → Response
![alt text](../ss/Screenshot%202026-06-27%20112627.png)

- Request Inputs → Crop Image → Gemini → Response
![alt text](../ss/Screenshot%202026-06-27%20113128.png)

## Screenshots

### Workflow Canvas

![alt text](../ss/Screenshot%202026-06-27%20113212.png)

### Execution History

![alt text](../ss/Screenshot%202026-06-27%20113245.png)

### Gemini Workflow

![alt text](../ss/Screenshot%202026-06-27%20113314.png)

### Crop Workflow

![alt text]("../ss/Screenshot%202026-06-27%20113332.png")

## Future Improvements

- PostgreSQL persistence using Prisma
- Additional AI nodes (classification, embeddings, summarization)
- File processing nodes (PDF, audio)
- Collaboration support (shared workflows, multi-user editing)

## Author

Shikhar Maheshwari

---


