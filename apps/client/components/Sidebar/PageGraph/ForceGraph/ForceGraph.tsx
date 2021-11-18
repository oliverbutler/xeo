import { GetPageGraphQuery } from 'generated';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

interface Props {
  pages: GetPageGraphQuery['pages'];
}

type Node = {
  id: string;
  radius: number;
} & d3.SimulationNodeDatum;

type Link = {
  source: number;
  target: number;
};

export const ForceGraph: React.FunctionComponent<Props> = ({ pages }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [simulatedNodes, setSimulatedNodes] = useState<Node[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const {
    query: { page: pageId },
  } = useRouter();

  const currentPageId = pageId as string;

  const width = ref.current?.offsetWidth ?? 0;
  const height = ref.current?.offsetHeight ?? 0;

  // @ts-ignore
  useEffect(() => {
    const formattedPages: Node[] = pages.map((page) => ({
      id: page.id,
      radius: 5,
    }));

    const newNodes = new Set(formattedPages);

    // remove newNodes that are no longer in the set
    const existingNodesThatAreInNewNodes = simulatedNodes.filter((node) =>
      newNodes.has(node)
    );

    const existingNodesThatStillExist = new Set(existingNodesThatAreInNewNodes);

    // stitch together the newNodes and the existingNodes
    const newNodesAndExistingNodes = [
      ...newNodes,
      ...existingNodesThatStillExist,
    ];

    console.log(
      'combined',
      newNodesAndExistingNodes,
      newNodes,
      existingNodesThatStillExist
    );

    // const formattedLinks = pages.map((page) => {
    //   const source = simulatedNodes.findIndex((node) => node.id === page.id);
    //   const target = simulatedNodes.findIndex(
    //     (node) => node.id === page.parentId
    //   );

    //   return {
    //     source,
    //     target: target === -1 ? source : target,
    //   };
    // });

    const simulation = d3
      .forceSimulation<Node>(newNodesAndExistingNodes)
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('charge', d3.forceManyBody().strength(-500))
      .force(
        'collision',
        d3.forceCollide<Node>().radius((node) => node.radius)
      );
    // .force('link', d3.forceLink().links(formattedLinks).distance(50));

    simulation.on('tick', () => {
      setSimulatedNodes([...simulation.nodes()]);
    });

    simulation.alpha(0.5).alphaMin(0.05).restart();

    return () => simulation.stop();
  }, [pages, width, height]);

  return (
    <div ref={ref} className="h-full w-full">
      <svg className="w-full h-full">
        {links.map((link) => {
          const source = simulatedNodes[link.source];
          const target = simulatedNodes[link.target];

          if (source && target) {
            return (
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="gray"
                opacity={0.4}
                key={`link-${link.source}-${link.target}`}
              />
            );
          }
        })}
        {simulatedNodes.map((node) => {
          const page = pages.find((page) => page.id === node.id);

          if (node.x && node.y && page) {
            return (
              <Link href={`/page/${page?.id}`} key={node.id}>
                <g className="cursor-pointer">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    stroke="black"
                    fill={page?.id === currentPageId ? 'yellow' : 'white'}
                  />

                  <text
                    textAnchor="middle"
                    className="text-xs"
                    x={node.x}
                    y={Number(node.y) + 25}
                  >
                    {page.properties.image?.__typename === 'Emoji'
                      ? page.properties.image.emoji
                      : ''}{' '}
                    {page.properties.title.rawText}
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
