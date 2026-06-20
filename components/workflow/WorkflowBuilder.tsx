"use client";

import { useEffect } from "react";
import HistoryPanel from "./HistoryPanel";
import WorkflowCanvas from "./WorkflowCanvas";
import WorkflowHeader from "./WorkflowHeader";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useWorkflowStore } from "@/stores/workflow-store";

interface WorkflowBuilderProps {
  workflowId: string;
}

export default function WorkflowBuilder({ workflowId }: WorkflowBuilderProps) {
  const initialize = useWorkflowStore((state) => state.initialize);
  const undo = useWorkflowStore((state) => state.undo);
  const redo = useWorkflowStore((state) => state.redo);
  const { workflows, isHydrated } = useWorkflows();
  const workflowName = workflows.find((workflow) => workflow.id === workflowId)?.name;

  useEffect(() => {
    initialize(workflowId);
  }, [initialize, workflowId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();

      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [redo, undo]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <WorkflowHeader
        workflowId={workflowId}
        workflowName={isHydrated ? workflowName : undefined}
      />

      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          <WorkflowCanvas />
        </div>
        <HistoryPanel />
      </div>
    </div>
  );
}
