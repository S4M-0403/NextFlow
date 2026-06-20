import type { Edge } from "@xyflow/react";

export function getExecutionLevels(
  nodeIds: string[],
  edges: Edge[],
): string[][] {
  const nodeSet = new Set(nodeIds);
  const relevantEdges = edges.filter(
    (edge) => nodeSet.has(edge.source) && nodeSet.has(edge.target),
  );

  const incomingCount = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const nodeId of nodeIds) {
    incomingCount.set(nodeId, 0);
    adjacency.set(nodeId, []);
  }

  for (const edge of relevantEdges) {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const levels: string[][] = [];
  let currentLevel = nodeIds.filter((nodeId) => (incomingCount.get(nodeId) ?? 0) === 0);

  if (currentLevel.length === 0 && nodeIds.length > 0) {
    return [nodeIds];
  }

  const visited = new Set<string>();

  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    currentLevel.forEach((nodeId) => visited.add(nodeId));

    const nextLevel: string[] = [];

    for (const nodeId of currentLevel) {
      for (const targetId of adjacency.get(nodeId) ?? []) {
        incomingCount.set(targetId, (incomingCount.get(targetId) ?? 1) - 1);
        if ((incomingCount.get(targetId) ?? 0) === 0 && !visited.has(targetId)) {
          nextLevel.push(targetId);
          visited.add(targetId);
        }
      }
    }

    currentLevel = nextLevel;
  }

  const remaining = nodeIds.filter((nodeId) => !visited.has(nodeId));
  if (remaining.length > 0) {
    levels.push(remaining);
  }

  return levels;
}

export function getUpstreamNodeIds(
  nodeId: string,
  edges: Edge[],
): string[] {
  const upstream = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.target === current && !upstream.has(edge.source)) {
        upstream.add(edge.source);
        queue.push(edge.source);
      }
    }
  }

  return Array.from(upstream);
}

export function getNodesForScope(
  scope: "node" | "selection" | "workflow",
  nodeIds: string[],
  allNodeIds: string[],
  edges: Edge[],
): string[] {
  if (scope === "workflow") {
    return allNodeIds;
  }

  if (scope === "node") {
    const targetId = nodeIds[0];
    if (!targetId) return [];
    const upstream = getUpstreamNodeIds(targetId, edges);
    return [...upstream, targetId];
  }

  const selected = new Set(nodeIds);
  const expanded = new Set(nodeIds);

  for (const nodeId of nodeIds) {
    for (const upstreamId of getUpstreamNodeIds(nodeId, edges)) {
      if (selected.has(upstreamId)) {
        expanded.add(upstreamId);
      }
    }
  }

  return Array.from(expanded);
}
