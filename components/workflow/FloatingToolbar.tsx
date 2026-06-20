"use client";

import { Download, FileText, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";

export default function FloatingToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const setNodePickerOpen = useWorkflowStore((state) => state.setNodePickerOpen);
  const exportWorkflow = useWorkflowStore((state) => state.exportWorkflow);
  const importWorkflow = useWorkflowStore((state) => state.importWorkflow);
  const workflowId = useWorkflowStore((state) => state.workflowId);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${workflowId ?? "workflow"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
    setImportError(null);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const json = await file.text();
      const result = importWorkflow(json);

      if (!result.success) {
        setImportError(result.error ?? "Import failed.");
        return;
      }

      setMenuOpen(false);
      setImportError(null);
    } catch {
      setImportError("Could not read the selected file.");
    }
  };

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {menuOpen ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              onClick={handleExport}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-slate-500" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Upload className="h-4 w-4 text-slate-500" />
              Import JSON
            </button>
          </div>
        ) : null}

        {importError ? (
          <p className="max-w-xs rounded-full bg-red-50 px-3 py-1 text-[11px] text-red-600 shadow-sm">
            {importError}
          </p>
        ) : null}

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_10px_40px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            aria-label="Workflow import and export"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={`rounded-full p-2.5 transition-colors ${
              menuOpen
                ? "bg-slate-100 text-slate-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <FileText className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <button
            type="button"
            aria-label="Add node"
            onClick={() => setNodePickerOpen(true)}
            className="rounded-full bg-slate-900 p-2.5 text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}
