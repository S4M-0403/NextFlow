export type ExecutionScope = "node" | "selection" | "workflow";

export type RunStatus = "success" | "failed" | "partial";

export type NodeExecutionStatus = "idle" | "running" | "success" | "failed";

export interface ExecutionValue {
  type: "text" | "image" | "video" | "audio" | "file" | "json";
  value: unknown;
}

export interface NodeExecutionResult {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "success" | "failed";
  duration: number;
  input: Record<string, ExecutionValue | undefined>;
  output?: ExecutionValue;
  error?: string;
}

export interface WorkflowRun {
  id: string;
  timestamp: string;
  status: RunStatus;
  duration: number;
  scope: ExecutionScope;
  scopeLabel: string;
  nodeResults: NodeExecutionResult[];
}

export interface ExecutionContext {
  nodeId: string;
  nodeType: string;
  nodeData: Record<string, unknown>;
  inputs: Record<string, ExecutionValue | undefined>;
}

export interface Executor {
  readonly nodeType: string;
  execute(context: ExecutionContext): Promise<NodeExecutionResult>;
}
