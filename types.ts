
import type * as d3 from 'd3';

export interface Step {
  title: string;
  icon: string;
  question?: string;
  branches?: Record<string, string>;
  response?: string;
  description?: string;
  model?: string;
  temperature?: number;
  max_new_tokens?: number;
  purpose?: string;
  save_to?: string;
  fields?: string[];
  message?: string;
  next?: string;
}

export interface Flow {
  start: string;
  steps: Record<string, Step>;
}

export interface FlowData {
  agent_name: string;
  description: string;
  flow: Flow;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  step: Step;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
}
