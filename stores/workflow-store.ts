import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type XYPosition,
} from "@xyflow/react";
import { create } from "zustand";
import { workflowEngine } from "@/lib/execution/engine";
import { getNodesForScope } from "@/lib/execution/dag";
import demoWorkflow from "../lib/workflow/demo-workflow.json";
import type {
  ExecutionScope,
  NodeExecutionStatus,
  WorkflowRun,
} from "@/lib/execution/types";
// import { initialEdges, initialNodes, responseWorkflow } from "../lib/workflow/initial-graph";
import {
  initialEdges,
  initialNodes,
  REQUEST_INPUTS_NODE_ID,
  RESPONSE_NODE_ID,
  responseWorkflow
} from "@/lib/workflow/initial-graph";
import {
  WORKFLOW_EDGE_OPTIONS,
  isValidWorkflowConnection,
} from "@/lib/workflow/connection-validation";
import {
  getDefaultNodeData,
  type WorkflowNodeType,
} from "@/lib/workflow/node-catalog";
import {
  parseWorkflowImport,
  serializeWorkflowExport,
} from "@/lib/workflow/export-import";

interface WorkflowSnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface PersistedWorkflow {
  nodes: Node[];
  edges: Edge[];
  runHistory: WorkflowRun[];
  recentNodeTypes: WorkflowNodeType[];
}

const MAX_HISTORY = 50;

function getStorageKey(workflowId: string) {
  return `galaxy-workflow-store:${workflowId}`;
}

function loadPersistedWorkflow(workflowId: string): PersistedWorkflow | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getStorageKey(workflowId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PersistedWorkflow;
  } catch {
    return null;
  }
}
async function loadPersistedWorkflowFromDB(workflowId: string) {
  const res = await fetch(`/api/workflows/${workflowId}`);

  if (!res.ok) return null;

  return res.json();
}

function applyExecutionResultsToNodes(
  nodes: Node[],
  nodeResults: WorkflowRun["nodeResults"],
): Node[] {
  const resultsByNodeId = new Map(
    nodeResults.map((result) => [result.nodeId, result]),
  );

  return nodes.map((node) => {
    const result = resultsByNodeId.get(node.id);
    if (!result) return node;

    if (result.nodeType === "geminiPro") {
      return {
        ...node,
        data: {
          ...node.data,
          responseOutput:
            result.status === "success" && result.output?.type === "text"
              ? String(result.output.value)
              : undefined,
          executionError: result.error,
        },
      };
    }
    if (result.nodeType === "cropImage") {
  return {
    ...node,
    data: {
      ...node.data,
      outputImage:
        result.status === "success" && result.output?.type === "image"
          ? String(result.output.value)
          : undefined,
      executionError: result.error,
    },
  };
}

    return node;
  });
}

function clearGeminiExecutionOutput(nodes: Node[], nodeIds: Set<string>): Node[] {
  return nodes.map((node) => {
    if (node.type !== "geminiPro" || !nodeIds.has(node.id)) return node;

    return {
      ...node,
      data: {
        ...node.data,
        responseOutput: undefined,
        executionError: undefined,
      },
    };
  });
}

function withExecutionState(
  nodes: Node[],
  nodeExecutionStates: Record<string, NodeExecutionStatus>,
): Node[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      executionStatus: nodeExecutionStates[node.id] ?? "idle",
    },
  }));
}

interface WorkflowStore {
  workflowId: string | null;
  nodes: Node[];
  edges: Edge[];
  selectedNodeIds: string[];
  runHistory: WorkflowRun[];
  nodeExecutionStates: Record<string, NodeExecutionStatus>;
  recentNodeTypes: WorkflowNodeType[];
  nodePickerOpen: boolean;
  isExecuting: boolean;
  past: WorkflowSnapshot[];
  future: WorkflowSnapshot[];
  viewportCenter: XYPosition | null;

  initialize: (workflowId: string) => void;
  setViewportCenter: (position: XYPosition) => void;
  setNodePickerOpen: (open: boolean) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onSelectionChange: (nodeIds: string[]) => void;
  addNode: (type: WorkflowNodeType, position?: XYPosition) => string;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Record<string, unknown>) => void;
  connectNodes: (connection: Connection) => boolean;
  disconnectNodes: (edgeId: string) => void;
  persistWorkflow: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => { success: boolean; error?: string };
  pushHistorySnapshot: () => void;
  undo: () => void;
  redo: () => void;
  runWorkflow: (scope: ExecutionScope, targetNodeIds?: string[]) => Promise<void>;
  runSingleNode: (nodeId: string) => Promise<void>;
  resetExecutionStates: () => void;
}

function createSnapshot(state: WorkflowStore): WorkflowSnapshot {
  return {
    nodes: state.nodes,
    edges: state.edges,
  };
}

function pushPast(state: WorkflowStore): WorkflowSnapshot[] {
  const snapshot = createSnapshot(state);
  const past = [...state.past, snapshot];
  if (past.length > MAX_HISTORY) past.shift();
  return past;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflowId: null,
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeIds: [],
  runHistory: [],
  nodeExecutionStates: {},
  recentNodeTypes: [],
  nodePickerOpen: false,
  isExecuting: false,
  past: [],
  future: [],
  viewportCenter: null,

  initialize: async (workflowId) => {
    const persisted =
      await loadPersistedWorkflowFromDB(workflowId);
  let defaultNodes: Node[] = demoWorkflow.nodes as Node[];
let defaultEdges: Edge[] = demoWorkflow.edges as Edge[];

  if (workflowId === "blank-workflow") {
    defaultNodes = responseWorkflow.nodes;
    defaultEdges = responseWorkflow.edges;
  } else if (workflowId !== "demo-workflow") {
    // Any newly created workflow starts blank
    defaultNodes = initialNodes;
    defaultEdges = initialEdges;
  }

  set({
    workflowId,
    nodes: persisted?.nodes ?? defaultNodes,
    
    edges: persisted?.edges ?? defaultEdges,
    runHistory: persisted?.runHistory ?? [],
    recentNodeTypes: persisted?.recentNodeTypes ?? [],
    selectedNodeIds: [],
    nodeExecutionStates: {},
    nodePickerOpen: false,
    isExecuting: false,
    past: [],
    future: [],
    viewportCenter: null,
  });
},

  setViewportCenter: (position) => set({ viewportCenter: position }),

  setNodePickerOpen: (open) => set({ nodePickerOpen: open }),

  onNodesChange: (changes) => {
  set((state) => {
    const filteredChanges = changes.filter((change) => {
      if (change.type !== "remove") return true;

      const node = state.nodes.find((n) => n.id === change.id);

      return !node?.data?.locked;
    });

    return {
      nodes: applyNodeChanges(filteredChanges, state.nodes),
    };
  });

  get().persistWorkflow();
},
  

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    get().persistWorkflow();
  },

  onSelectionChange: (nodeIds) => set({ selectedNodeIds: nodeIds }),

  addNode: (type, position) => {
    const state = get();
    const id = crypto.randomUUID();
    const center = position ??
      state.viewportCenter ?? {
        x: 420,
        y: 280,
      };

    const jitter = {
      x: center.x + (Math.random() * 80 - 40),
      y: center.y + (Math.random() * 80 - 40),
    };

    const newNode: Node = {
      id,
      type,
      position: jitter,
      data: getDefaultNodeData(type),
    };

    const recentNodeTypes = [
      type,
      ...state.recentNodeTypes.filter((item) => item !== type),
    ].slice(0, 6);

    set({
      past: pushPast(state),
      future: [],
      nodes: [...state.nodes, newNode],
      recentNodeTypes,
      nodePickerOpen: false,
    });

    get().persistWorkflow();
    return id;
  },

  removeNode: (nodeId) => {
  const node = get().nodes.find((n) => n.id === nodeId);

if (node?.data?.locked) {
  return;
}

  set((state) => {
    const nodeIdsToRemove = new Set([nodeId]);

    return {
      past: pushPast(state),
      future: [],
      nodes: state.nodes.filter((node) => !nodeIdsToRemove.has(node.id)),
      edges: state.edges.filter(
        (edge) =>
          !nodeIdsToRemove.has(edge.source) &&
          !nodeIdsToRemove.has(edge.target),
      ),
    };
  });

  get().persistWorkflow();
},

  updateNode: (nodeId, data) => {
    const state = get();
    set({
      past: pushPast(state),
      future: [],
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
    get().persistWorkflow();
  },

  connectNodes: (connection) => {
    const state = get();
    if (!isValidWorkflowConnection(connection, state.nodes, state.edges)) {
      return false;
    }

    const edgeId = `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`;

    set({
      past: pushPast(state),
      future: [],
      edges: [
        ...state.edges,
        {
          id: edgeId,
          ...connection,
          ...WORKFLOW_EDGE_OPTIONS,
        },
      ],
    });
    get().persistWorkflow();
    return true;
  },

  disconnectNodes: (edgeId) => {
    const state = get();
    set({
      past: pushPast(state),
      future: [],
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    });
    get().persistWorkflow();
  },
  
  persistWorkflow: () => {
    
    const { workflowId, nodes, edges, runHistory, recentNodeTypes } = get();
    console.log("persistWorkflow called", workflowId);
  if (!workflowId || typeof window === "undefined") return;

  const payload: PersistedWorkflow = {
    nodes,
    edges,
    runHistory,
    recentNodeTypes,
  };

  // Keep localStorage for now (fallback)
  window.localStorage.setItem(
    getStorageKey(workflowId),
    JSON.stringify(payload)
  );
console.log("Sending workflow to Prisma");
  // Save to database
  fetch("/api/workflows", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflowId,
      nodes,
      edges,
      runHistory,
      recentNodeTypes,
    }),
  }).catch((err) => {
    console.error("Failed to save workflow:", err);
  });
},

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return serializeWorkflowExport(nodes, edges);
  },

  importWorkflow: (json) => {
    const parsed = parseWorkflowImport(json);
    if ("error" in parsed) {
      return { success: false, error: parsed.error };
    }

    const state = get();
    set({
      past: pushPast(state),
      future: [],
      nodes: parsed.nodes,
      edges: parsed.edges,
      selectedNodeIds: [],
      nodeExecutionStates: {},
    });
    get().persistWorkflow();
    return { success: true };
  },

  pushHistorySnapshot: () => {
    const state = get();
    set({
      past: pushPast(state),
      future: [],
    });
  },

  undo: () => {
    const state = get();
    const previous = state.past[state.past.length - 1];
    if (!previous) return;

    set({
      past: state.past.slice(0, -1),
      future: [createSnapshot(state), ...state.future].slice(0, MAX_HISTORY),
      nodes: previous.nodes,
      edges: previous.edges,
    });
    get().persistWorkflow();
  },

  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) return;

    set({
      future: state.future.slice(1),
      past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
      nodes: next.nodes,
      edges: next.edges,
    });
    get().persistWorkflow();
  },

  resetExecutionStates: () => {
    set({ nodeExecutionStates: {} });
  },

  runSingleNode: async (nodeId) => {
    await get().runWorkflow("node", [nodeId]);
  },

  runWorkflow: async (scope, targetNodeIds = []) => {
    const state = get();
    if (state.isExecuting) return;

    const nodeIds =
      scope === "workflow"
        ? state.nodes.map((node) => node.id)
        : scope === "selection"
          ? targetNodeIds.length > 0
            ? targetNodeIds
            : state.selectedNodeIds
          : targetNodeIds;

    if (nodeIds.length === 0) return;

    const executionNodeIds = new Set(
      getNodesForScope(
        scope,
        nodeIds,
        state.nodes.map((node) => node.id),
        state.edges,
      ),
    );

    set({
      isExecuting: true,
      nodeExecutionStates: {},
      nodes: clearGeminiExecutionOutput(state.nodes, executionNodeIds),
    });

    try {
      await workflowEngine.execute({
        scope,
        targetNodeIds: nodeIds,
        nodes: get().nodes,
        edges: state.edges,
        callbacks: {
          onNodeStatusChange: (nodeId, status) => {
            set((current) => ({
              nodeExecutionStates: {
                ...current.nodeExecutionStates,
                [nodeId]: status,
              },
            }));
          },
          onRunComplete: (run) => {
            set((current) => ({
              nodes: applyExecutionResultsToNodes(current.nodes, run.nodeResults),
              runHistory: [run, ...current.runHistory].slice(0, 30),
              isExecuting: false,
            }));
            get().persistWorkflow();
          },
        },
      });
    } catch {
      set({ isExecuting: false });
    }
  },
}));

export function useWorkflowNodes(): Node[] {
  const nodes = useWorkflowStore((state) => state.nodes);
  const nodeExecutionStates = useWorkflowStore(
    (state) => state.nodeExecutionStates,
  );

  return withExecutionState(nodes, nodeExecutionStates);
}
