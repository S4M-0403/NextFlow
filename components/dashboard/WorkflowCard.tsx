"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { formatLastEdited } from "@/lib/utils/format-date";
import type { Workflow } from "@/lib/types/workflow";

interface WorkflowCardProps {
  workflow: Workflow;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function WorkflowCard({
  workflow,
  onRename,
  onDelete,
}: WorkflowCardProps) {
  const router = useRouter();

  const handleRename = () => {
    const nextName = window.prompt("Rename workflow", workflow.name);
    if (nextName !== null) {
      onRename(workflow.id, nextName);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${workflow.name}"? This action cannot be undone.`,
    );
    if (confirmed) {
      onDelete(workflow.id);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{workflow.name}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {formatLastEdited(workflow.lastEdited)}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => router.push(`/workflow/${workflow.id}`)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </button>

        <button
          type="button"
          onClick={handleRename}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Rename
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </article>
  );
}
