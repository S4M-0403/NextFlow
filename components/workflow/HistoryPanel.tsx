"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
} from "lucide-react";
import type { RunStatus, WorkflowRun } from "@/lib/execution/types";
import { formatExecutionValue } from "@/lib/execution/utils";
import { useWorkflowStore } from "@/stores/workflow-store";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: RunStatus }) {
  const styles: Record<RunStatus, string> = {
    success: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
    partial: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function RunHistoryItem({ run }: { run: WorkflowRun }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-slate-50"
      >
        <div className="mt-0.5 text-slate-400">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-slate-900">
              {run.scopeLabel}
            </p>
            <StatusBadge status={run.status} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
            <span>{formatTimestamp(run.timestamp)}</span>
            <span>{formatDuration(run.duration)}</span>
            <span className="capitalize">{run.scope}</span>
            <span>{run.nodeResults.length} nodes</span>
          </div>
        </div>
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 px-3 py-3">
          {run.nodeResults.map((result) => (
            <div
              key={`${run.id}-${result.nodeId}`}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {result.nodeName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDuration(result.duration)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    result.status === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {result.status === "success" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {result.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Input
                  </p>
                  <pre className="mt-1 max-h-24 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-600">
                    {formatExecutionValue(result.input)}
                  </pre>
                </div>

                {result.output ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Output
                    </p>
                    <pre className="mt-1 max-h-24 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-600">
                      {formatExecutionValue(result.output.value)}
                    </pre>
                  </div>
                ) : null}

                {result.error ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">
                      Error
                    </p>
                    <p className="mt-1 rounded-md bg-red-50 p-2 text-[11px] text-red-600">
                      {result.error}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function HistoryPanel() {
  const runHistory = useWorkflowStore((state) => state.runHistory);
  const isExecuting = useWorkflowStore((state) => state.isExecuting);

const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
  className={`flex h-full shrink-0 flex-col border-l border-slate-200 bg-white transition-all duration-300 ${
    collapsed ? "w-12" : "w-[320px]"
  }`}
>
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-4">
  {!collapsed && (
    <div className="flex items-center gap-2">
      <History className="h-4 w-4 text-slate-500" />
      <h2 className="text-sm font-semibold text-slate-900">
        History
      </h2>
    </div>
  )}

  <button
    type="button"
    onClick={() => setCollapsed(!collapsed)}
    className="rounded-md p-1 hover:bg-slate-100"
  >
    {collapsed ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )}
  </button>

  {!collapsed && isExecuting && (
    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
      Running
    </span>
  )}
</div>
      
      {!collapsed && (
  <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {runHistory.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">No runs yet</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Workflow execution history will appear here after you run nodes or the
              full workflow.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {runHistory.map((run) => (
              <RunHistoryItem key={run.id} run={run} />
            ))}
          </div>
        )}
      </div>
      
)}
</aside>
  );
}
