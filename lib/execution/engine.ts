import type { Edge, Node } from "@xyflow/react";
import { getExecutionLevels, getNodesForScope } from "./dag";
import {
  CropImageExecutor,
  GeminiExecutor,
  RequestInputsExecutor,
  ResponseExecutor,
} from "./executors";
import type {
  ExecutionContext,
  ExecutionScope,
  ExecutionValue,
  Executor,
  NodeExecutionResult,
  RunStatus,
  WorkflowRun,
} from "./types";

const executors: Record<string, Executor> = {
  requestInputs: new RequestInputsExecutor(),
  geminiPro: new GeminiExecutor(),
  cropImage: new CropImageExecutor(),
  response: new ResponseExecutor(),
};

function getNodeName(node: Node): string {
  switch (node.type) {
    case "requestInputs":
      return "Request Inputs";
    case "geminiPro":
      return "Gemini 3.1 Pro";
    case "cropImage":
      return "Crop Image";
    case "response":
      return "Response";
    default:
      return node.type ?? "Unknown Node";
  }
}

function resolveInputs(
  node: Node,
  edges: Edge[],
  completedResults: Map<string, NodeExecutionResult>,
): Record<string, ExecutionValue | undefined> {
  const inputs: Record<string, ExecutionValue | undefined> = {};
  const incomingEdges = edges.filter((edge) => edge.target === node.id);

  for (const edge of incomingEdges) {
    const sourceResult = completedResults.get(edge.source);
    if (!sourceResult?.output) continue;

    const handleId = edge.targetHandle ?? "input";

    if (sourceResult.nodeType === "requestInputs" && edge.sourceHandle) {
      const requestOutputs = sourceResult.output.value as Record<
        string,
        ExecutionValue
      >;
      inputs[handleId] = requestOutputs[edge.sourceHandle];
      continue;
    }

    inputs[handleId] = sourceResult.output;
  }

  if (node.type === "geminiPro") {
    const data = node.data as Record<string, unknown>;
    if (!inputs.prompt && data.prompt) {
      inputs.prompt = { type: "text", value: data.prompt };
    }
    if (!inputs["system-prompt"] && data.systemPrompt) {
      inputs["system-prompt"] = { type: "text", value: data.systemPrompt };
    }
  }

  if (node.type === "response") {
    const result = inputs.result ?? inputs.input;
    if (result) inputs.result = result;
  }

  return inputs;
}

function getScopeLabel(scope: ExecutionScope, nodeIds: string[], nodes: Node[]): string {
  if (scope === "workflow") return "Entire workflow";
  if (scope === "selection") {
    return `${nodeIds.length} selected node${nodeIds.length === 1 ? "" : "s"}`;
  }

  const node = nodes.find((item) => item.id === nodeIds[0]);
  return node ? getNodeName(node) : "Single node";
}

function deriveRunStatus(results: NodeExecutionResult[]): RunStatus {
  const successCount = results.filter((result) => result.status === "success").length;
  if (successCount === results.length) return "success";
  if (successCount === 0) return "failed";
  return "partial";
}

export interface WorkflowEngineCallbacks {
  onNodeStatusChange: (nodeId: string, status: "running" | "success" | "failed") => void;
  onRunComplete: (run: WorkflowRun) => void;
}

export class WorkflowEngine {
  async execute({
    scope,
    targetNodeIds,
    nodes,
    edges,
    callbacks,
  }: {
    scope: ExecutionScope;
    targetNodeIds: string[];
    nodes: Node[];
    edges: Edge[];
    callbacks: WorkflowEngineCallbacks;
  }): Promise<WorkflowRun> {
    const runStartedAt = Date.now();
    const runId = crypto.randomUUID();
    const allNodeIds = nodes.map((node) => node.id);
    const executionNodeIds = getNodesForScope(
      scope,
      targetNodeIds,
      allNodeIds,
      edges,
    );
    const levels = getExecutionLevels(executionNodeIds, edges);
    const completedResults = new Map<string, NodeExecutionResult>();
    const nodeResults: NodeExecutionResult[] = [];

    for (const level of levels) {
      const levelResults = await Promise.all(
        level.map(async (nodeId) => {
          const node = nodes.find((item) => item.id === nodeId);
          if (!node?.type) {
            const failedResult: NodeExecutionResult = {
              nodeId,
              nodeName: "Unknown",
              nodeType: "unknown",
              status: "failed",
              duration: 0,
              input: {},
              error: "Node not found.",
            };
            callbacks.onNodeStatusChange(nodeId, "failed");
            return failedResult;
          }

          callbacks.onNodeStatusChange(nodeId, "running");

          const executor = executors[node.type];
          if (!executor) {
            const failedResult: NodeExecutionResult = {
              nodeId,
              nodeName: getNodeName(node),
              nodeType: node.type,
              status: "failed",
              duration: 0,
              input: {},
              error: `No executor registered for node type "${node.type}".`,
            };
            callbacks.onNodeStatusChange(nodeId, "failed");
            return failedResult;
          }

          const context: ExecutionContext = {
            nodeId,
            nodeType: node.type,
            nodeData: node.data as Record<string, unknown>,
            inputs: resolveInputs(node, edges, completedResults),
          };

          try {
            const result = await executor.execute(context);
            completedResults.set(nodeId, result);
            callbacks.onNodeStatusChange(
              nodeId,
              result.status === "success" ? "success" : "failed",
            );
            return result;
          } catch (error) {
            const failedResult: NodeExecutionResult = {
              nodeId,
              nodeName: getNodeName(node),
              nodeType: node.type,
              status: "failed",
              duration: 0,
              input: context.inputs,
              error:
                error instanceof Error ? error.message : "Unknown execution error.",
            };
            callbacks.onNodeStatusChange(nodeId, "failed");
            return failedResult;
          }
        }),
      );

      nodeResults.push(...levelResults);
    }

    const run: WorkflowRun = {
      id: runId,
      timestamp: new Date().toISOString(),
      status: deriveRunStatus(nodeResults),
      duration: Date.now() - runStartedAt,
      scope,
      scopeLabel: getScopeLabel(scope, targetNodeIds, nodes),
      nodeResults,
    };

    callbacks.onRunComplete(run);
    return run;
  }
}

export const workflowEngine = new WorkflowEngine();
