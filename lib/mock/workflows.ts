import type { Workflow } from "@/lib/types/workflow";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "demo-workflow",
    name: "Demo Workflow",
    lastEdited: new Date().toISOString(),
  },
  {
    id: "blank-workflow",
    name: "Blank Workflow",
    lastEdited: new Date().toISOString(),
  },
];

export const WORKFLOWS_STORAGE_KEY = "galaxy-workflows";