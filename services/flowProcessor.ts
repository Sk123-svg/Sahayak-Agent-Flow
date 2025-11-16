
import type { Flow, GraphNode, GraphLink } from '../types';

export const processFlowData = (flow: Flow): { nodes: GraphNode[], links: GraphLink[] } => {
  const nodes: GraphNode[] = Object.keys(flow.steps).map(id => ({
    id,
    step: flow.steps[id]
  }));

  const links: GraphLink[] = [];
  Object.entries(flow.steps).forEach(([sourceId, step]) => {
    if (step.next) {
      links.push({ source: sourceId, target: step.next });
    }
    if (step.branches) {
      Object.entries(step.branches).forEach(([label, targetId]) => {
        links.push({ source: sourceId, target: targetId, label });
      });
    }
  });

  return { nodes, links };
};
