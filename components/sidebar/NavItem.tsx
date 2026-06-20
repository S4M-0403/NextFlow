import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
        active
          ? "bg-slate-200/70 text-slate-900"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );
}
