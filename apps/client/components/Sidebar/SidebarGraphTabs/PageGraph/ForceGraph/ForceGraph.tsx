import { GetPageGraphQuery } from 'generated';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';
import { usePageContext } from 'context/PageContext';
import { useTheme } from 'next-themes';
import classNames from 'classnames';

interface Props {
  pageGraph: GetPageGraphQuery;
}

type Node = {
  id: string;
  radius: number;
} & d3.SimulationNodeDatum;

type Link = {
  source: number;
  target: number;
};

export const ForceGraph: React.FunctionComponent<Props> = ({ pageGraph }) => {
  const [links, setLinks] = useState<d3.SimulationLinkDatum<Node>[]>([]);
  const [simulatedNodes, setSimulatedNodes] = useState<Node[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const { currentPageId } = usePageContext();

  const { theme } = useTheme();

  const width = ref.current?.offsetWidth ?? 0;
  const height = ref.current?.offsetHeight ?? 0;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    const formattedPages: Node[] = pageGraph.pages.map((page) => ({
      id: page.id,
      radius: 5,
      x: width / 2,
      y: height / 2,
    }));

    const newNodes = Object.fromEntries(
      new Map(formattedPages.map((page) => [page.id, page]))
    );

    const existingNodesWhichStillExistArray = [...simulatedNodes].filter(
      (node) => newNodes[node.id]
    );

    const existingNodesObject = Object.fromEntries(
      new Map(existingNodesWhichStillExistArray.map((node) => [node.id, node]))
    );

    const nodesObject = { ...newNodes, ...existingNodesObject };

    const nodes = Object.values(nodesObject);

    const newLinks = pageGraph.pageLinks.map((link) => {
      const source = nodes.findIndex((node) => node.id === link.fromId);
      const target = nodes.findIndex((node) => node.id === link.toId);

      return {
        source,
        target: target === -1 ? source : target,
      };
    });

    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('charge', d3.forceManyBody().strength(-500))
      .force(
        'collision',
        d3.forceCollide<Node>().radius((node) => node.radius)
      )
      .force('link', d3.forceLink().links(newLinks).distance(100));

    setLinks(newLinks);

    simulation.on('tick', () => {
      setSimulatedNodes([...simulation.nodes()]);
    });

    simulation.tick(1);

    // simulation.alpha(0.5).alphaMin(0.05).restart();

    return () => simulation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageGraph, currentPageId, width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg className="w-full h-full" key="sidebar-svg">
        {links.map((link) => {
          const source = link.source as Node;
          const target = link.target as Node;

          return (
            <line
              key={`link-${source.id}-${target.id}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="gray"
              opacity={0.4}
            />
          );
        })}
        {simulatedNodes.map((node) => {
          const page = pageGraph.pages.find((page) => page.id === node.id);

          const targetedNodesFromCurrentPage = currentPageId
            ? [
                currentPageId,
                ...pageGraph.pageLinks
                  .filter((link) => link.fromId === currentPageId)
                  .map((link) => link.toId),
              ]
            : [];

          const isTargeted = targetedNodesFromCurrentPage.includes(node.id);

          const fillColour =
            page?.id === currentPageId ? 'pink' : isTargeted ? 'white' : 'gray';

          if (node.x && node.y) {
            return (
              <Link href={`/page/${page?.id}`} key={node.id} passHref={true}>
                <g className="cursor-pointer " opacity={isTargeted ? 1 : 0.5}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    stroke="black"
                    fill={fillColour}
                  />

                  <text
                    textAnchor="middle"
                    className="text-xs"
                    fill={
                      isTargeted
                        ? theme === 'dark'
                          ? 'white'
                          : 'black'
                        : 'gray'
                    }
                    x={node.x}
                    y={Number(node.y) + 25}
                  >
                    {page?.emoji} {page?.titlePlainText}
                  </text>
                </g>
              </Link>
            );
          }
        })}
      </svg>
    </div>
  );
};
