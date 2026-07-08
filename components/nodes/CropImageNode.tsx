"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";

import { useCallback } from "react";
import NodeHandle from "./NodeHandle";
import SliderInput from "./SliderInput";
import NodePortRow from "./NodePortRow";
import NodeShell from "./NodeShell";
import { HANDLE_COLORS, type CropImageData } from "@/lib/types/node-data";
import type { NodeExecutionStatus } from "@/lib/execution/types";
import { useWorkflowStore } from "@/stores/workflow-store";
import { Crop, Upload } from "lucide-react";

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
      <div className="relative mb-3">
  <NodeHandle
    type="target"
    position={Position.Left}
    id="image"
    dataType="image"
    color={HANDLE_COLORS.image}
    style={{
      left: -6,
      top: "50%",
      transform: "translateY(-50%)",
    }}
  />
  
  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
    Input Image
  </label>

  <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-200 bg-white text-[11px] text-slate-400 transition hover:border-slate-300 hover:bg-slate-50">
  <Upload className="h-3.5 w-3.5" />
  Upload Image
  <input
    type="file"
    accept="image/*"
    className="hidden"
  />
</label>
</div>

      <div className="space-y-3">
        <SliderInput
          label="X Position (%)"
          
          value={nodeData.x}
          onChange={(value) =>
  update({
    x: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <SliderInput
          label="Y Position (%)"
          
          value={nodeData.y}
          onChange={(value) =>
  update({
    y: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <SliderInput
          label="Width (%)"
         
          value={nodeData.width}
          onChange={(value) =>
  update({
    width: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
        <SliderInput
          label="Height (%)"
          
          value={nodeData.height}
          onChange={(value) =>
  update({
    height: Math.min(100, Math.max(0, Number(value) || 0)),
  })
}
        />
      </div>

      <div className="relative pt-3">
  <NodeHandle
    type="source"
    position={Position.Right}
    id="output-image"
    dataType="image"
    color={HANDLE_COLORS.output}
    style={{ right: -6, top: "24px", transform: "translateY(-50%)" }}
  />

  <div className="mb-2 flex items-center justify-between">
    <span className="text-xs font-semibold text-slate-700">
      Output Image
    </span>

    <span className="text-[10px] uppercase tracking-wide text-sky-500">
      Output
    </span>
  </div>

  <div className="flex h-28 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
    {nodeData.outputImage ? (
  <img
    src={nodeData.outputImage}
    alt="Crop Output"
    className="mt-2 h-32 w-full rounded-md border border-slate-200 object-contain"
  />
) : (
  <div className="flex h-28 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
    No output yet
  </div>
)}
  </div>
</div>
    </NodeShell>
  );
}
