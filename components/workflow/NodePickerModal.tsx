"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  Crop,
  Search,
  Sparkles,
  Video,
  Volume2,
  X,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  NODE_CATALOG,
  type CatalogNode,
  type NodeCategory,
  type WorkflowNodeType,
} from "@/lib/workflow/node-catalog";
import { useWorkflowStore } from "@/stores/workflow-store";

const CATEGORY_ORDER: NodeCategory[] = [
  "recent",
  "image",
  "video",
  "audio",
  "others",
];

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "gemini-pro": Sparkles,
  "crop-image": Crop,
  "stable-video": Video,
  "audio-gen": Volume2,
};

function NodePickerItem({
  node,
  onSelect,
}: {
  node: CatalogNode;
  onSelect: (type: WorkflowNodeType) => void;
}) {
  const Icon = ICONS[node.id] ?? Sparkles;

  return (
    <button
      type="button"
      disabled={!node.functional}
      onClick={() => onSelect(node.type)}
      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        node.functional
          ? "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50"
          : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          node.functional ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{node.name}</p>
          {!node.functional ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              Soon
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {node.description}
        </p>
      </div>
    </button>
  );
}

export default function NodePickerModal() {
  const open = useWorkflowStore((state) => state.nodePickerOpen);
  const setNodePickerOpen = useWorkflowStore((state) => state.setNodePickerOpen);
  const addNode = useWorkflowStore((state) => state.addNode);
  const recentNodeTypes = useWorkflowStore((state) => state.recentNodeTypes);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<NodeCategory>("recent");

  const recentNodes = useMemo(
    () =>
      recentNodeTypes
        .map((type) => NODE_CATALOG.find((node) => node.type === type && node.functional))
        .filter((node): node is CatalogNode => Boolean(node)),
    [recentNodeTypes],
  );

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return NODE_CATALOG.filter((node) => {
      const matchesQuery =
        !normalized ||
        node.name.toLowerCase().includes(normalized) ||
        node.description.toLowerCase().includes(normalized) ||
        node.keywords.some((keyword) => keyword.includes(normalized));

      if (!matchesQuery) return false;
      if (activeCategory === "recent") return node.functional;
      return node.category === activeCategory;
    });
  }, [activeCategory, query]);

  const handleSelect = (type: WorkflowNodeType) => {
    addNode(type);
    setQuery("");
    setActiveCategory("recent");
  };

  if (!open) return null;

  const displayNodes =
    activeCategory === "recent" && !query ? recentNodes : filteredCatalog;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add Node</h2>
            <p className="text-sm text-slate-500">
              Search and add nodes to your workflow canvas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNodePickerOpen(false)}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Close node picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search nodes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="w-40 shrink-0 border-r border-slate-200 bg-slate-50 p-3">
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {displayNodes.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium text-slate-700">No nodes found</p>
                <p className="mt-1 text-xs text-slate-400">
                  {activeCategory === "recent"
                    ? "Recently used nodes will appear here."
                    : "Try another category or search term."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayNodes.map((node) => (
                  <NodePickerItem
                    key={`${node.id}-${node.name}`}
                    node={node}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
