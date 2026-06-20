"use client";

import { useWorkflows } from "@/hooks/useWorkflows";
import FlowHeader from "./FlowHeader";
import FlowHero from "./FlowHero";
import NewWorkflowButton from "./NewWorkflowButton";
import WorkflowCard from "./WorkflowCard";

export default function FlowDashboard() {
  const { workflows, isHydrated, createWorkflow, renameWorkflow, deleteWorkflow } =
    useWorkflows();

  const handleCreate = () => {
    const workflow = createWorkflow();
    return workflow.id;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-screen-xl px-8 py-8 md:px-12 md:py-10">
        <FlowHeader />

        <div className="mt-8">
          <FlowHero />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Your Workflows
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage and open your saved workflows.
              </p>
            </div>
            <NewWorkflowButton onCreate={handleCreate} />
          </div>

          {!isHydrated ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                No workflows yet. Create your first workflow to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onRename={renameWorkflow}
                  onDelete={deleteWorkflow}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
