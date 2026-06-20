import type { Workflow } from "@/lib/types/workflow";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "AI Racing Car Generator",
    lastEdited: "2025-06-19T10:30:00.000Z",
  },
  {
    id: "wf-2",
    name: "Image Upscaler",
    lastEdited: "2025-06-18T14:20:00.000Z",
  },
  {
    id: "wf-3",
    name: "Text to Video Pipeline",
    lastEdited: "2025-06-17T09:15:00.000Z",
  },
];

export const WORKFLOWS_STORAGE_KEY = "galaxy-workflows";
