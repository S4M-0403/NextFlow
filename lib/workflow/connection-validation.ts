import type { Connection, Edge, Node } from "@xyflow/react";
import { getHandleDataType } from "./handle-registry";
import { areHandleTypesCompatible } from "./handle-types";

type ConnectionLike = Connection | Edge;

function toConnection(connection: ConnectionLike): Connection {
  return {
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle ?? null,
    targetHandle: connection.targetHandle ?? null,
  };
}

function buildAdjacency(edges: Edge[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const edge of edges) {
    const neighbors = adjacency.get(edge.source) ?? [];
    neighbors.push(edge.target);
    adjacency.set(edge.source, neighbors);
  }

  return adjacency;
}

export function wouldCreateCycle(
  source: string,
  target: string,
  edges: Edge[],
): boolean {
  if (source === target) return true;

  const adjacency = buildAdjacency(edges);
  const visited = new Set<string>();
  const queue = [target];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (nodeId === source) return true;
    if (visited.has(nodeId)) continue;

    visited.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      queue.push(neighbor);
    }
  }

  return false;
}

function hasExistingTargetConnection(
  edges: Edge[],
  target: string,
  targetHandle: string,
  ignoreEdgeId?: string,
): boolean {
  return edges.some(
    (edge) =>
      edge.id !== ignoreEdgeId &&
      edge.target === target &&
      edge.targetHandle === targetHandle,
  );
}

export type ConnectionValidationReason =
  | "missing-handles"
  | "same-node"
  | "unknown-handle"
  | "type-mismatch"
  | "target-occupied"
  | "cycle";

export function getConnectionValidationReason(
  connection: ConnectionLike,
  nodes: Node[],
  edges: Edge[],
  ignoreEdgeId?: string,
): ConnectionValidationReason | null {
  const { source, target, sourceHandle, targetHandle } = toConnection(connection);

  if (!source || !target || !sourceHandle || !targetHandle) {
    return "missing-handles";
  }

  if (source === target) {
    return "same-node";
  }

  const sourceNode = nodes.find((node) => node.id === source);
  const targetNode = nodes.find((node) => node.id === target);

  if (!sourceNode || !targetNode) {
    return "unknown-handle";
  }

  const sourceType = getHandleDataType(sourceNode, sourceHandle, "source");
  const targetType = getHandleDataType(targetNode, targetHandle, "target");

  if (!sourceType || !targetType) {
    return "unknown-handle";
  }

  if (!areHandleTypesCompatible(sourceType, targetType)) {
    return "type-mismatch";
  }

  const allowMultipleConnections =
  targetType === "image";

if (
  !allowMultipleConnections &&
  hasExistingTargetConnection(
    edges,
    target,
    targetHandle,
    ignoreEdgeId,
  )
) {
  return "target-occupied";
}

  if (wouldCreateCycle(source, target, edges)) {
    return "cycle";
  }

  return null;
}

export function isValidWorkflowConnection(
  connection: ConnectionLike,
  nodes: Node[],
  edges: Edge[],
  ignoreEdgeId?: string,
): boolean {
  return (
    getConnectionValidationReason(connection, nodes, edges, ignoreEdgeId) ===
    null
  );
}

export const WORKFLOW_EDGE_STYLE = {
  stroke: "#8b5cf6",
  strokeWidth: 2,
} as const;

export const WORKFLOW_EDGE_OPTIONS = {
  type: "smoothstep" as const,
  animated: true,
  style: WORKFLOW_EDGE_STYLE,
};
