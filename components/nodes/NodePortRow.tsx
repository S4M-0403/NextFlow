"use client";

import { Position } from "@xyflow/react";
import { Link2 } from "lucide-react";
import { useHandleConnected } from "@/hooks/useHandleConnected";
import type { HandleDataType } from "@/lib/workflow/handle-types";
import NodeHandle from "./NodeHandle";

interface NodePortRowProps {
  nodeId: string;
  label: string;
  handleId: string;
  handleType: "source" | "target";
  dataType: HandleDataType;
  color: string;
  position: Position;
  children?: React.ReactNode;
}

export default function NodePortRow({
  nodeId,
  label,
  handleId,
  handleType,
  dataType,
  color,
  position,
  children,
}: NodePortRowProps) {
  const isTarget = handleType === "target";
  const isConnected = useHandleConnected({
    nodeId,
    handleId,
    handleType,
  });

  return (
    <div className="relative">
      <NodeHandle
        type={handleType}
        position={position}
        id={handleId}
        dataType={dataType}
        color={color}
        style={
          isTarget
            ? { left: -6, top: "50%", transform: "translateY(-50%)" }
            : { right: -6, top: "50%", transform: "translateY(-50%)" }
        }
      />

      <div className={isTarget ? "pl-1" : "pr-1"}>
        {children ?? (
          <div
            className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
              isConnected
                ? "border-slate-200 bg-slate-100"
                : "border-dashed border-slate-200 bg-slate-50"
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isConnected ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {label}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wide ${
                isConnected ? "font-medium text-violet-500" : "text-slate-400"
              }`}
            >
              {isConnected ? (
                <>
                  <Link2 className="h-3 w-3" />
                  Connected
                </>
              ) : isTarget ? (
                "Input"
              ) : (
                "Output"
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
