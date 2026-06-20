import type { LucideIcon } from "lucide-react";
import { Play } from "lucide-react";
import type { NodeExecutionStatus } from "@/lib/execution/types";

interface NodeShellProps {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
  selected?: boolean;
  showRun?: boolean;
  widthClassName?: string;
  executionStatus?: NodeExecutionStatus;
  onRun?: () => void;
  children: React.ReactNode;
}

function shellStateClass(
  selected: boolean,
  executionStatus: NodeExecutionStatus,
): string {
  if (executionStatus === "running") {
    return "node-shell-running border-violet-400";
  }
  if (executionStatus === "success") {
    return "node-shell-success border-emerald-400";
  }
  if (executionStatus === "failed") {
    return "node-shell-failed border-red-400";
  }
  if (selected) {
    return "border-violet-400 ring-2 ring-violet-100";
  }
  return "border-slate-200";
}

export default function NodeShell({
  title,
  icon: Icon,
  iconClassName = "text-slate-600",
  iconBgClassName = "bg-slate-100",
  selected = false,
  showRun = true,
  widthClassName = "w-[300px]",
  executionStatus = "idle",
  onRun,
  children,
}: NodeShellProps) {
  return (
    <div
      className={`${widthClassName} rounded-2xl border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow ${shellStateClass(selected, executionStatus)}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBgClassName}`}
          >
            <Icon className={`h-4 w-4 ${iconClassName}`} />
          </div>
          <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
        </div>

        {showRun ? (
          <button
            type="button"
            onClick={onRun}
            className="nodrag nowheel inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            <Play className="h-3 w-3 fill-current" />
            Run
          </button>
        ) : null}
      </div>

      <div className="space-y-3 px-4 py-3">{children}</div>
    </div>
  );
}
