
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '../types';

interface FlowDiagramProps {
  nodes: GraphNode[];
  links: GraphLink[];
  startNodeId: string;
}

const NODE_WIDTH = 224; // 56 * 4
const NODE_HEIGHT = 128; // 32 * 4

const FlowDiagram: React.FC<FlowDiagramProps> = ({ nodes: initialNodes, links: initialLinks, startNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    setNodes(initialNodes.map(n => ({ ...n })));
    setLinks(initialLinks.map(l => ({ ...l })));

    const svg = d3.select(svgRef.current);
    const parent = svg.node()?.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    svg.attr('width', width).attr('height', height);
    svg.attr('viewBox', [-width / 2, -height / 2, width, height].join(' '));

    const simulation = d3.forceSimulation<GraphNode>(initialNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(initialLinks).id(d => d.id).distance(250))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(0, 0))
      .on('tick', () => {
        setNodes([...simulation.nodes()]);
        setLinks([...initialLinks]);
      });
    
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        d3.select(svgRef.current?.querySelector('g')).attr('transform', event.transform.toString());
      });

    svg.call(zoomBehavior);

    return () => simulation.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes, initialLinks]);


  const renderNodeContent = (step: GraphNode['step']) => {
    const details = [
      step.question && { label: "Question", value: step.question },
      step.description && { label: "Description", value: step.description },
      step.response && { label: "Response", value: step.response },
      step.purpose && { label: "Purpose", value: step.purpose },
      step.message && { label: "Message", value: step.message },
      step.model && { label: "Model", value: `${step.model} (T:${step.temperature}, MT:${step.max_new_tokens})`},
      step.save_to && { label: "Storage", value: `${step.save_to} (${step.fields?.join(', ')})`},
    ].filter(Boolean);

    return (
        <div className="text-xs text-slate-600 p-2 space-y-1 overflow-y-auto h-full">
            {details.map((item, index) => (
                item && <div key={index}>
                    <strong className="text-slate-800 block">{item.label}:</strong>
                    <p className="whitespace-normal break-words">{item.value}</p>
                </div>
            ))}
        </div>
    );
};

  return (
    <svg ref={svgRef} className="cursor-grab active:cursor-grabbing">
      <defs>
        <marker id="arrowhead" viewBox="0 -5 10 10" refX={15} refY={0} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,-5L10,0L0,5" className="fill-current text-slate-400"></path>
        </marker>
        <marker id="arrowhead-branch" viewBox="0 -5 10 10" refX={15} refY={0} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,-5L10,0L0,5" className="fill-current text-indigo-500"></path>
        </marker>
      </defs>
      <g>
        {links.map((link, i) => {
            const sourceNode = nodes.find(n => n.id === (link.source as GraphNode).id);
            const targetNode = nodes.find(n => n.id === (link.target as GraphNode).id);
            if (!sourceNode || !targetNode) return null;

            const isBranch = !!link.label;
            const linkClass = isBranch ? 'stroke-indigo-500' : 'stroke-slate-400';

            return (
              <g key={i}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className={`stroke-2 ${linkClass}`}
                  markerEnd={isBranch ? "url(#arrowhead-branch)" : "url(#arrowhead)"}
                />
                {link.label && (
                   <text
                    x={(sourceNode.x! + targetNode.x!) / 2}
                    y={(sourceNode.y! + targetNode.y!) / 2 - 5}
                    textAnchor="middle"
                    className="text-[10px] font-semibold fill-indigo-700 bg-white px-1"
                    style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '3px', strokeLinejoin: 'round' }}
                  >
                    {link.label}
                  </text>
                )}
              </g>
            );
        })}
        {nodes.map(node => (
            <foreignObject key={node.id} x={node.x! - NODE_WIDTH / 2} y={node.y! - NODE_HEIGHT / 2} width={NODE_WIDTH} height={NODE_HEIGHT}>
              <div
                  className={`w-full h-full rounded-lg shadow-md flex flex-col transition-all duration-300
                  ${node.step.next === 'end' || node.id === 'end' ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-300'}
                  ${node.id === startNodeId ? 'border-2 border-blue-500' : 'border'}
                  ${node.step.branches?.unsafe ? 'bg-red-50 border-red-400' : ''}
                  `}
                >
                  <div className="flex items-center p-2 border-b bg-slate-50 rounded-t-md">
                    <span className="text-2xl mr-2">{node.step.icon}</span>
                    <h3 className="font-bold text-sm text-slate-900 truncate">{node.step.title}</h3>
                  </div>
                  <div className="flex-grow overflow-hidden">
                     {renderNodeContent(node.step)}
                  </div>
                </div>
            </foreignObject>
        ))}
      </g>
    </svg>
  );
};

export default FlowDiagram;
