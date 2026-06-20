import {
  BarChart2,
  BookOpen,
  Boxes,
  Folder,
  GitBranch,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Gift,
} from "lucide-react";
import NavItem from "./NavItem";
import SidebarUserSection from "./SidebarUserSection";

interface SidebarProps {
  activeNav?: string;
}

const navItems = [
  { href: "#", label: "New Task", icon: Plus },
  { href: "#", label: "Search Task", icon: Search },
  { href: "#", label: "Task", icon: MessageSquare },
  { href: "#", label: "Projects", icon: Folder },
  { href: "#", label: "Library", icon: BarChart2 },
  { href: "/dashboard", label: "Flow", icon: GitBranch },
  { href: "#", label: "Nodes", icon: Boxes },
  { href: "#", label: "API Docs / MCP", icon: BookOpen },
] as const;

export default function Sidebar({ activeNav = "Flow" }: SidebarProps) {
  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          Galaxy.ai
        </span>
        <button
          type="button"
          aria-label="Collapse sidebar"
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.label === activeNav}
          />
        ))}
      </nav>

      <div className="flex flex-1 items-center justify-center px-5">
        <p className="text-sm text-slate-400">No tasks yet</p>
      </div>

      <div className="space-y-3 border-t border-slate-200 p-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Gift className="h-4 w-4" />
          Claim Offer
        </button>

        <SidebarUserSection />      </div>
    </aside>
  );
}
