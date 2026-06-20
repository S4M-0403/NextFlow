import { Link2 } from "lucide-react";

interface NodeInputProps {
  label: string;
  value?: string | number;
  placeholder?: string;
  type?: "text" | "number";
  onChange?: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  connected?: boolean;
}

export default function NodeInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
  multiline = false,
  rows = 3,
  disabled = false,
  connected = false,
}: NodeInputProps) {
  const fieldClassName = [
    "nodrag nowheel w-full rounded-lg border px-3 py-2 text-xs transition-colors",
    connected
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 placeholder:text-slate-300"
      : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100",
  ].join(" ");

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-medium uppercase tracking-wide ${
            connected ? "text-slate-300" : "text-slate-400"
          }`}
        >
          {label}
        </span>
        {connected ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-500">
            <Link2 className="h-3 w-3" />
            Connected
          </span>
        ) : null}
      </span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={connected ? "Value provided by connection" : placeholder}
          rows={rows}
          disabled={disabled || connected}
          onChange={(event) => onChange?.(event.target.value)}
          className={`${fieldClassName} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={connected ? "Value provided by connection" : placeholder}
          disabled={disabled || connected}
          onChange={(event) => onChange?.(event.target.value)}
          className={fieldClassName}
        />
      )}
    </label>
  );
}
