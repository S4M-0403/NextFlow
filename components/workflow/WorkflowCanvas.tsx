"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type IsValidConnection,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./workflow-canvas.css";

import { workflowNodeTypes } from "@/components/nodes/node-types";
import FloatingToolbar from "@/components/workflow/FloatingToolbar";
import NodePickerModal from "@/components/workflow/NodePickerModal";
import WorkflowConnectionLine from "@/components/workflow/WorkflowConnectionLine";
import {
  WORKFLOW_EDGE_OPTIONS,
  isValidWorkflowConnection,
} from "@/lib/workflow/connection-validation";
import {
  useWorkflowNodes,
  useWorkflowStore,
} from "@/stores/workflow-store";

function WorkflowCanvasInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useWorkflowNodes();
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onSelectionChange = useWorkflowStore((state) => state.onSelectionChange);
  const connectNodes = useWorkflowStore((state) => state.connectNodes);
  const disconnectNodes = useWorkflowStore((state) => state.disconnectNodes);
  const pushHistorySnapshot = useWorkflowStore((state) => state.pushHistorySnapshot);
  const setViewportCenter = useWorkflowStore((state) => state.setViewportCenter);
  const { screenToFlowPosition } = useReactFlow();

  const updateViewportCenter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const center = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setViewportCenter(center);
  }, [screenToFlowPosition, setViewportCenter]);

  useEffect(() => {
    updateViewportCenter();
    window.addEventListener("resize", updateViewportCenter);
    return () => window.removeEventListener("resize", updateViewportCenter);
  }, [updateViewportCenter]);

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => isValidWorkflowConnection(connection, nodes, edges),
    [nodes, edges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isValidWorkflowConnection(connection, nodes, edges)) return;
      connectNodes(connection);
    },
    [connectNodes, edges, nodes],
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const edgesWithoutOld = edges.filter((edge) => edge.id !== oldEdge.id);
      if (!isValidWorkflowConnection(newConnection, nodes, edgesWithoutOld)) {
        return;
      }

      disconnectNodes(oldEdge.id);
      connectNodes(newConnection);
    },
    [connectNodes, disconnectNodes, edges, nodes],
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      onSelectionChange(selectedNodes.map((node) => node.id));
    },
    [onSelectionChange],
  );

  return (
    <div ref={containerRef} className="relative h-full w-full min-w-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onSelectionChange={handleSelectionChange}
        onNodeDragStart={pushHistorySnapshot}
        onMoveEnd={updateViewportCenter}
        edgesReconnectable
        isValidConnection={isValidConnection}
        nodeTypes={workflowNodeTypes}
        connectionLineComponent={WorkflowConnectionLine}
        defaultEdgeOptions={WORKFLOW_EDGE_OPTIONS}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        minZoom={0.25}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-100"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="#cbd5e1"
        />
        <Controls
          showZoom
          showFitView
          showInteractive
          position="bottom-left"
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-sm"
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor="#e2e8f0"
          nodeStrokeColor="#94a3b8"
          maskColor="rgba(248, 250, 252, 0.75)"
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-sm"
        />
      </ReactFlow>

      <FloatingToolbar />
      <NodePickerModal />
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <div className="h-full w-full min-w-0">
      <ReactFlowProvider>
        <WorkflowCanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
