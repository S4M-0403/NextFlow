"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { useCallback } from "react";
import { useHandleConnected } from "@/hooks/useHandleConnected";
import CollapsibleSection from "./CollapsibleSection";
import NodeHandle from "./NodeHandle";
import NodeInput from "./NodeInput";
import NodePortRow from "./NodePortRow";
import NodeShell from "./NodeShell";
import { HANDLE_COLORS, type GeminiProData } from "@/lib/types/node-data";
import type { NodeExecutionStatus } from "@/lib/execution/types";
import { useWorkflowStore } from "@/stores/workflow-store";

const defaultData: GeminiProData = {
  prompt: "",
  systemPrompt: "",
  settingsOpen: false,
  temperature: 0.7,
  maxTokens: 2048,
};

export default function GeminiProNode({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const runSingleNode = useWorkflowStore((state) => state.runSingleNode);
  const nodeData = { ...defaultData, ...(data as GeminiProData) };
  const executionStatus =
    (data?.executionStatus as NodeExecutionStatus | undefined) ?? "idle";
  const promptConnected = useHandleConnected({
    nodeId: id,
    handleId: "prompt",
  });
  const systemPromptConnected = useHandleConnected({
    nodeId: id,
    handleId: "system-prompt",
  });

  const update = useCallback(
    (patch: Partial<GeminiProData>) => {
      updateNodeData(id, patch);
    },
    [id, updateNodeData],
  );

  return (
    <NodeShell
      title="Gemini 3.1 Pro"
      icon={Sparkles}
      iconClassName="text-violet-600"
      iconBgClassName="bg-violet-50"
      selected={selected}
      executionStatus={executionStatus}
      onRun={() => void runSingleNode(id)}
      widthClassName="w-[340px]"
    >
      <div className="relative space-y-3">
        <div className="relative">
          <NodeHandle
            type="target"
            position={Position.Left}
            id="prompt"
            dataType="text"
            color={HANDLE_COLORS.text}
            style={{ left: -6, top: 28 }}
          />
          <NodeInput
            label="Prompt"
            value={nodeData.prompt}
            placeholder="Enter your prompt..."
            multiline
            rows={3}
            connected={promptConnected}
            disabled={promptConnected}
            onChange={(prompt) => update({ prompt })}
          />
        </div>

        <div className="relative">
          <NodeHandle
            type="target"
            position={Position.Left}
            id="system-prompt"
            dataType="text"
            color={HANDLE_COLORS.text}
            style={{ left: -6, top: 28 }}
          />
          <NodeInput
            label="System Prompt"
            value={nodeData.systemPrompt}
            placeholder="Optional system instructions..."
            multiline
            rows={2}
            connected={systemPromptConnected}
            disabled={systemPromptConnected}
            onChange={(systemPrompt) => update({ systemPrompt })}
          />
        </div>

        <NodePortRow
          nodeId={id}
          label="Image Vision"
          handleId="image-vision"
          handleType="target"
          dataType="image"
          color={HANDLE_COLORS.image}
          position={Position.Left}
        />

        <NodePortRow
          nodeId={id}
          label="Video"
          handleId="video"
          handleType="target"
          dataType="video"
          color={HANDLE_COLORS.video}
          position={Position.Left}
        />

        <NodePortRow
          nodeId={id}
          label="Audio"
          handleId="audio"
          handleType="target"
          dataType="audio"
          color={HANDLE_COLORS.audio}
          position={Position.Left}
        />

        <NodePortRow
          nodeId={id}
          label="File"
          handleId="file"
          handleType="target"
          dataType="file"
          color={HANDLE_COLORS.file}
          position={Position.Left}
        />

        <CollapsibleSection
          title="Settings"
          open={nodeData.settingsOpen}
          onToggle={() => update({ settingsOpen: !nodeData.settingsOpen })}
        >
          <NodeInput
            label="Temperature"
            type="number"
            value={nodeData.temperature}
            onChange={(value) => update({ temperature: Number(value) || 0 })}
          />
          <NodeInput
            label="Max Tokens"
            type="number"
            value={nodeData.maxTokens}
            onChange={(value) => update({ maxTokens: Number(value) || 0 })}
          />
        </CollapsibleSection>

        <div className="relative pt-1">
          <NodeHandle
            type="source"
            position={Position.Right}
            id="response"
            dataType="text"
            color={HANDLE_COLORS.response}
            style={{ right: -6, top: "50%", transform: "translateY(-50%)" }}
          />
          <div className="rounded-lg border border-slate-200 bg-violet-50 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-700">Response</span>
              <span className="text-[10px] uppercase tracking-wide text-violet-400">
                Output
              </span>
            </div>

            {executionStatus === "running" ? (
              <p className="mt-2 text-[11px] text-violet-500">Generating...</p>
            ) : nodeData.executionError ? (
              <p className="mt-2 rounded-md bg-red-50 p-2 text-[11px] leading-relaxed text-red-600">
                {nodeData.executionError}
              </p>
            ) : nodeData.responseOutput ? (
              <pre className="nodrag nowheel mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-md bg-white/80 p-2 text-[11px] leading-relaxed text-slate-700">
                {nodeData.responseOutput}
              </pre>
            ) : (
              <p className="mt-2 text-[11px] text-violet-400">
                Run the node to generate a response.
              </p>
            )}
          </div>
        </div>
      </div>
    </NodeShell>
  );
}
