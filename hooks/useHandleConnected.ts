"use client";

import { useNodeConnections } from "@xyflow/react";

interface UseHandleConnectedOptions {
  nodeId: string;
  handleId: string;
  handleType?: "source" | "target";
}

export function useHandleConnected({
  nodeId,
  handleId,
  handleType = "target",
}: UseHandleConnectedOptions) {
  const connections = useNodeConnections({
    id: nodeId,
    handleType,
    handleId,
  });

  return connections.length > 0;
}
