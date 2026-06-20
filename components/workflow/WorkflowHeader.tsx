"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Coins,
  Play,
  Redo2,
  Undo2,
  Wallet,
} from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";

interface WorkflowHeaderProps {
  workflowId: string;
  workflowName?: string;
}

export default function WorkflowHeader({
  workflowId,
  workflowName,
}: WorkflowHeaderProps) {
  const title = workflowName ?? "Untitled Workflow";
  const runWorkflow = useWorkflowStore((state) => state.runWorkflow);
  const isExecuting = useWorkflowStore((state) => state.isExecuting);
  const selectedNodeIds = useWorkflowStore((state) => state.selectedNodeIds);
  const undo = useWorkflowStore((state) => state.undo);
  const redo = useWorkflowStore((state) => state.redo);
  const pastLength = useWorkflowStore((state) => state.past.length);
  const futureLength = useWorkflowStore((state) => state.future.length);

  const handleRun = () => {
    if (selectedNodeIds.length > 1) {
      void runWorkflow("selection", selectedNodeIds);
      return;
    }

    if (selectedNodeIds.length === 1) {
      void runWorkflow("node", selectedNodeIds);
      return;
    }

    void runWorkflow("workflow");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
          <p className="truncate text-sm font-medium text-slate-800">{title}</p>
          <p className="truncate text-[11px] text-slate-400">{workflowId}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={pastLength === 0}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={futureLength === 0}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          Est 1.72 M
        </div>

        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <Wallet className="h-3.5 w-3.5 text-slate-500" />
          Bal 0.00 M
        </div>

        <button
          type="button"
          aria-label="Run workflow"
          disabled={isExecuting}
          onClick={handleRun}
          className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          <Play className="h-4 w-4 fill-current" />
        </button>
      </div>
    </header>
  );
}
