"use client";

import { Position, type NodeProps } from "@xyflow/react";
import { Link2, Send } from "lucide-react";
import { useHandleConnected } from "@/hooks/useHandleConnected";
import NodeHandle from "./NodeHandle";
import NodeShell from "./NodeShell";
import { HANDLE_COLORS } from "@/lib/types/node-data";
import type { NodeExecutionStatus } from "@/lib/execution/types";
import { useWorkflowStore } from "@/stores/workflow-store";

export default function ResponseNode({ id, data, selected }: NodeProps) {
  const runSingleNode = useWorkflowStore((state) => state.runSingleNode);
  const executionStatus =
    (data?.executionStatus as NodeExecutionStatus | undefined) ?? "idle";
  const resultConnected = useHandleConnected({
    nodeId: id,
    handleId: "result",
  });

  return (
    <NodeShell
      title="Response"
      icon={Send}
      iconClassName="text-emerald-600"
      iconBgClassName="bg-emerald-50"
      selected={selected}
      showRun
      executionStatus={executionStatus}
      onRun={() => void runSingleNode(id)}
      widthClassName="w-[280px]"
    >
      <div className="relative">
        <NodeHandle
          type="target"
          position={Position.Left}
          id="result"
          dataType="text"
          color={HANDLE_COLORS.result}
          style={{ left: -6, top: "50%", transform: "translateY(-50%)" }}
        />

        <div
          className={`rounded-lg border px-3 py-6 text-center transition-colors ${
            resultConnected
              ? "border-slate-200 bg-slate-100"
              : "border-dashed border-slate-200 bg-slate-50"
          }`}
        >
          <p
            className={`text-xs font-medium ${
              resultConnected ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Result
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {resultConnected
              ? "Receiving output from a connected node."
              : "Connect a text output to display the final result."}
          </p>
          {resultConnected ? (
            <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-violet-500">
              <Link2 className="h-3 w-3" />
              Connected
            </p>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1 text-[10px] text-slate-400">
              <Link2 className="h-3 w-3" />
              Accepts text connections only
            </p>
          )}
        </div>
      </div>
    </NodeShell>
  );
}
