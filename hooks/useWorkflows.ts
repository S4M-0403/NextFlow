"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MOCK_WORKFLOWS,
  WORKFLOWS_STORAGE_KEY,
} from "@/lib/mock/workflows";
import type { Workflow } from "@/lib/types/workflow";

async function loadWorkflows(): Promise<Workflow[]> {
  const res = await fetch("/api/workflows");

  if (!res.ok) {
    return MOCK_WORKFLOWS;
  }

  const data = await res.json();

return [
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
  ...data.map((workflow: any) => ({
    id: workflow.workflowId,
    name: workflow.workflowId, // or "Untitled Workflow"
    lastEdited: workflow.updatedAt,
  })),
];
}

function saveWorkflows(workflows: Workflow[]) {
  window.localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
  async function initialize() {
    const data = await loadWorkflows();
    setWorkflows(data);
    setIsHydrated(true);
  }

  initialize();
}, []);

  useEffect(() => {
    if (isHydrated) {
      saveWorkflows(workflows);
    }
  }, [workflows, isHydrated]);

  const createWorkflow = useCallback((): Workflow => {
    const workflow: Workflow = {
      id: crypto.randomUUID(),
      name: "Untitled Workflow",
      lastEdited: new Date().toISOString(),
    };

    setWorkflows((current) => [workflow, ...current]);
    return workflow;
  }, []);

  const renameWorkflow = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? { ...workflow, name: trimmed, lastEdited: new Date().toISOString() }
          : workflow,
      ),
    );
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows((current) => current.filter((workflow) => workflow.id !== id));
  }, []);

  return {
    workflows,
    isHydrated,
    createWorkflow,
    renameWorkflow,
    deleteWorkflow,
  };
}
