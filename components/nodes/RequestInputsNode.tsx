"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { FormInput, Image as ImageIcon, Plus, Type } from "lucide-react";
import { useCallback, useState } from "react";
import NodeHandle from "./NodeHandle";
import NodeShell from "./NodeShell";
import {
  HANDLE_COLORS,
  type InputField,
  type InputFieldType,
  type RequestInputsData,
} from "@/lib/types/node-data";
import type { NodeExecutionStatus } from "@/lib/execution/types";
import type { HandleDataType } from "@/lib/workflow/handle-types";
import { useWorkflowStore } from "@/stores/workflow-store";

const defaultData: RequestInputsData = {
  fields: [
    {
      id: "field-text-1",
      type: "text",
      label: "Text Field",
      value: "",
    },
    {
      id: "field-image-1",
      type: "image",
      label: "Image Field",
      value: "",
    },
  ],
};

function fieldColor(type: InputFieldType) {
  return type === "text" ? HANDLE_COLORS.text : HANDLE_COLORS.image;
}

function fieldIcon(type: InputFieldType) {
  return type === "text" ? Type : ImageIcon;
}

export default function RequestInputsNode({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const runSingleNode = useWorkflowStore((state) => state.runSingleNode);
  const nodeData = { ...defaultData, ...(data as RequestInputsData) };
  const executionStatus =
    (data?.executionStatus as NodeExecutionStatus | undefined) ?? "idle";
  const [menuOpen, setMenuOpen] = useState(false);

  const setFields = useCallback(
    (fields: InputField[]) => {
      updateNodeData(id, { fields });
    },
    [id, updateNodeData],
  );

  const addField = (type: InputFieldType) => {
    const label = type === "text" ? "Text Field" : "Image Field";
    const count =
      nodeData.fields.filter((field) => field.type === type).length + 1;

    setFields([
      ...nodeData.fields,
      {
        id: crypto.randomUUID(),
        type,
        label: count > 1 ? `${label} ${count}` : label,
        value: "",
      },
    ]);
    setMenuOpen(false);
  };

  return (
    <NodeShell
      title="Request Inputs"
      icon={FormInput}
      iconClassName="text-violet-600"
      iconBgClassName="bg-violet-50"
      selected={selected}
      showRun
      executionStatus={executionStatus}
      onRun={() => void runSingleNode(id)}
      widthClassName="w-[280px]"
    >
      <div className="space-y-2">
        {nodeData.fields.map((field) => {
          const Icon = fieldIcon(field.type);

          return (
            <div key={field.id} className="relative flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md ${
                    field.type === "text" ? "bg-blue-50" : "bg-orange-50"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      field.type === "text" ? "text-blue-500" : "text-orange-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col flex-1">
  <span className="text-xs font-medium text-slate-700">
    {field.label}
  </span>

  {field.type === "text" ? (
    <input
  type="text"
  value={field.value ?? ""}
  onChange={(e) => {
    setFields(
      nodeData.fields.map((f) =>
        f.id === field.id
          ? { ...f, value: e.target.value }
          : f
      )
    );
  }}
  placeholder="Enter text..."
  className="nodrag nowheel mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
/>
  ) : (
  <input
    type="file"
    accept="image/*"
    className="nodrag nowheel mt-1 w-full text-xs text-slate-900"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        setFields(
          nodeData.fields.map((f) =>
            f.id === field.id
              ? {
                  ...f,
                  value: reader.result as string,
                }
              : f
          )
        );
      };

      reader.readAsDataURL(file);
    }}
  />
)}
</div>
              </div>

              <NodeHandle
                type="source"
                position={Position.Right}
                id={field.id}
                dataType={field.type as HandleDataType}
                color={fieldColor(field.type)}
                style={{ right: -18, top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          );
        })}
      </div>

      <div className="relative pt-1">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="nodrag nowheel flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Field
        </button>

        {menuOpen ? (
          <div className="nodrag nowheel absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => addField("text")}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <Type className="h-3.5 w-3.5 text-blue-500" />
              Text Field
            </button>
            <button
              type="button"
              onClick={() => addField("image")}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              <ImageIcon className="h-3.5 w-3.5 text-orange-500" />
              Image Field
            </button>
          </div>
        ) : null}
      </div>
    </NodeShell>
  );
}
