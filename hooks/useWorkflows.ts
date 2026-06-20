"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MOCK_WORKFLOWS,
  WORKFLOWS_STORAGE_KEY,
} from "@/lib/mock/workflows";
import type { Workflow } from "@/lib/types/workflow";

function loadWorkflows(): Workflow[] {
  if (typeof window === "undefined") return MOCK_WORKFLOWS;

  const stored = window.localStorage.getItem(WORKFLOWS_STORAGE_KEY);
  if (!stored) return MOCK_WORKFLOWS;

  try {
    return JSON.parse(stored) as Workflow[];
  } catch {
    return MOCK_WORKFLOWS;
  }
}

function saveWorkflows(workflows: Workflow[]) {
  window.localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setWorkflows(loadWorkflows());
    setIsHydrated(true);
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
