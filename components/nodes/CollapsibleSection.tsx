import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className="nodrag nowheel flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-slate-100"
      >
        <span className="text-xs font-semibold text-slate-700">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? <div className="space-y-3 border-t border-slate-200 p-3">{children}</div> : null}
    </div>
  );
}
