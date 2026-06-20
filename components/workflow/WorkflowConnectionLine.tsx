"use client";

import {
  getSmoothStepPath,
  type ConnectionLineComponentProps,
} from "@xyflow/react";

export default function WorkflowConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  const stroke =
    connectionStatus === "valid"
      ? "#8b5cf6"
      : connectionStatus === "invalid"
        ? "#ef4444"
        : "#94a3b8";

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={connectionStatus === "invalid" ? "6 4" : undefined}
        className={
          connectionStatus === "valid" ? "workflow-connection-line-valid" : ""
        }
      />
      {connectionStatus === "invalid" ? (
        <circle cx={toX} cy={toY} r={6} fill="#ef4444" opacity={0.25} />
      ) : null}
    </g>
  );
}
