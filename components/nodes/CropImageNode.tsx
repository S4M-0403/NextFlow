"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { Crop } from "lucide-react";
import { useCallback } from "react";
import NodeHandle from "./NodeHandle";
import NodeInput from "./NodeInput";
import NodePortRow from "./NodePortRow";
import NodeShell from "./NodeShell";
import { HANDLE_COLORS, type CropImageData } from "@/lib/types/node-data";
import type { NodeExecutionStatus } from "@/lib/execution/types";
import { useWorkflowStore } from "@/stores/workflow-store";

const defaultData: CropImageData = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

export default function CropImageNode({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const runSingleNode = useWorkflowStore((state) => state.runSingleNode);
  const nodeData = { ...defaultData, ...(data as CropImageData) };
  const executionStatus =
    (data?.executionStatus as NodeExecutionStatus | undefined) ?? "idle";

  const update = useCallback(
    (patch: Partial<CropImageData>) => {
      updateNodeData(id, patch);
    },
    [id, updateNodeData],
  );

  return (
    <NodeShell
      title="Crop Image"
      icon={Crop}
      iconClassName="text-sky-600"
      iconBgClassName="bg-sky-50"
      selected={selected}
      executionStatus={executionStatus}
      onRun={() => void runSingleNode(id)}
      widthClassName="w-[300px]"
    >
      <NodePortRow
        nodeId={id}
        label="Input Image"
        handleId="image"
        handleType="target"
        dataType="image"
        color={HANDLE_COLORS.image}
        position={Position.Left}
      />

      <div className="grid grid-cols-2 gap-2">
        <NodeInput
          label="X Position (%)"
          type="number"
          value={nodeData.x}
          onChange={(value) =>
  update({
    x: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <NodeInput
          label="Y Position (%)"
          type="number"
          value={nodeData.y}
          onChange={(value) =>
  update({
    y: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <NodeInput
          label="Width (%)"
          type="number"
          value={nodeData.width}
          onChange={(value) =>
  update({
    width: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <NodeInput
          label="Height (%)"
          type="number"
          value={nodeData.height}
          onChange={(value) =>
  update({
    height: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
      </div>

      <div className="relative pt-1">
        <NodeHandle
          type="source"
          position={Position.Right}
          id="output-image"
          dataType="image"
          color={HANDLE_COLORS.output}
          style={{ right: -6, top: "50%", transform: "translateY(-50%)" }}
        />
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-sky-50 px-3 py-2.5">
          <span className="text-xs font-semibold text-sky-700">Output Image</span>
          <span className="text-[10px] uppercase tracking-wide text-sky-400">
            Output
          </span>
        </div>
      </div>
    </NodeShell>
  );
}
