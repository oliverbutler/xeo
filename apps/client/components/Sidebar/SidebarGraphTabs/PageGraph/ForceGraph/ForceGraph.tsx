import { GetPageGraphQuery } from 'generated';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { usePageContext } from 'context/PageContext';
import { syncNodes } from './forceGraph.utils';
import { Node as GraphNode } from './ForceGraph.interface';
import { Node } from './Node/Node';
import { Edge } from './Edge/Edge';

interface Props {
  pageGraph: GetPageGraphQuery;
}

export const ForceGraph: React.FunctionComponent<Props> = ({ pageGraph }) => {
  const [links, setLinks] = useState<d3.SimulationLinkDatum<GraphNode>[]>([]);
  const [simulatedNodes, setSimulatedNodes] = useState<GraphNode[]>([]);
  const { currentPageId } = usePageContext();

  const ref = useRef<HTMLDivElement>(null);

  const width = ref.current?.offsetWidth ?? 0;
  const height = ref.current?.offsetHeight ?? 0;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    const { nodes, links: newLinks } = syncNodes(
      pageGraph,
      simulatedNodes,
      height,
      width
    );

    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'collision',
        d3.forceCollide<GraphNode>().radius((node) => node.radius)
      )
      .force('link', d3.forceLink().links(newLinks).distance(75));

    setLinks(newLinks);

    simulation.on('tick', () => {
      setSimulatedNodes([...simulation.nodes()]);
    });

    simulation.alpha(1).alphaMin(0.1).velocityDecay(0.6).restart();

    return () => simulation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageGraph, currentPageId, width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg className="w-full h-full" key="sidebar-svg">
        {links.map((link) => {
          const source = link.source as GraphNode;
          const target = link.target as GraphNode;

          return <Edge key={link.index} source={source} target={target} />;
        })}
        {simulatedNodes.map((node) => {
          if (node.x && node.y) {
            return <Node key={node.id} node={node} pageGraph={pageGraph} />;
          }
        })}
      </svg>
    </div>
  );
};
