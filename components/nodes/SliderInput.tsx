type SliderInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export default function SliderInput({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
}: SliderInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>

      <div className="flex items-center gap-2">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 cursor-pointer accent-indigo-500"
        />

        {/* Value Box */}
        <div className="flex h-7 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700">
          {value}
        </div>
      </div>
    </div>
  );
}