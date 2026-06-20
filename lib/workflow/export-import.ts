import type { Edge, Node } from "@xyflow/react";
import { WORKFLOW_EDGE_OPTIONS } from "./connection-validation";

export const WORKFLOW_EXPORT_VERSION = 1;

export interface WorkflowExportPayload {
  version: typeof WORKFLOW_EXPORT_VERSION;
  exportedAt: string;
  nodes: Node[];
  edges: Edge[];
}

function sanitizeNode(node: Node): Node {
  const { executionStatus, responseOutput, executionError, ...restData } =
    (node.data ?? {}) as Record<string, unknown>;

  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: restData,
    ...(node.width ? { width: node.width } : {}),
    ...(node.height ? { height: node.height } : {}),
  };
}

function sanitizeEdge(edge: Edge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
    ...WORKFLOW_EDGE_OPTIONS,
  };
}

export function serializeWorkflowExport(nodes: Node[], edges: Edge[]): string {
  const payload: WorkflowExportPayload = {
    version: WORKFLOW_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    nodes: nodes.map(sanitizeNode),
    edges: edges.map(sanitizeEdge),
  };

  return JSON.stringify(payload, null, 2);
}

export function parseWorkflowImport(
  json: string,
):
  | { nodes: Node[]; edges: Edge[] }
  | { error: string } {
  let payload: unknown;

  try {
    payload = JSON.parse(json);
  } catch {
    return { error: "Invalid JSON file." };
  }

  if (!payload || typeof payload !== "object") {
    return { error: "Workflow export must be a JSON object." };
  }

  const record = payload as Partial<WorkflowExportPayload>;

  if (record.version !== WORKFLOW_EXPORT_VERSION) {
    return { error: "Unsupported workflow export version." };
  }

  if (!Array.isArray(record.nodes) || !Array.isArray(record.edges)) {
    return { error: "Workflow export is missing nodes or edges." };
  }

  const nodes = record.nodes.filter(
    (node): node is Node =>
      Boolean(node) &&
      typeof node === "object" &&
      typeof (node as Node).id === "string" &&
      typeof (node as Node).position === "object",
  );

  const edges = record.edges
    .filter(
      (edge): edge is Edge =>
        Boolean(edge) &&
        typeof edge === "object" &&
        typeof (edge as Edge).id === "string" &&
        typeof (edge as Edge).source === "string" &&
        typeof (edge as Edge).target === "string",
    )
    .map(sanitizeEdge);

  if (nodes.length === 0) {
    return { error: "Workflow export contains no valid nodes." };
  }

  return { nodes, edges };
}
