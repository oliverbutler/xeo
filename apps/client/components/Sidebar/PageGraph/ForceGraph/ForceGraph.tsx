import { GetPageGraphQuery } from 'generated';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import Link from 'next/link';
import { useBlock } from 'hooks/useBlock';
import { useRouter } from 'next/dist/client/router';

interface Props {
  pages: GetPageGraphQuery['pages'];
}

type Node = {
  id: string;
  radius: number;
} & SimulationNodeDatum;

type Link = {
  source: number;
  target: number;
};

export const ForceGraph: React.FunctionComponent<Props> = ({ pages }) => {
  const [animatedNodes, setAnimatedNodes] = useState<Node[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const {
    query: { page },
  } = useRouter();

  const currentPageId = page as string;

  const originalPageNodes: Node[] = useMemo(
    () =>
      pages.map((page, index) => ({
        id: page.id,
        index: index,
        radius: 5,
      })),
    [pages, currentPageId]
  );

  const originalPageLinks: Link[] = pages.map((page, index) => {
    const parent = pages.find((p) => p.id === page.parentId);

    return {
      source: index,
      target: parent ? pages.indexOf(parent) : index,
    };
  });

  const width = ref.current?.offsetWidth ?? 0;
  const height = ref.current?.offsetHeight ?? 0;

  // @ts-ignore
  useEffect(() => {
    const linksClone = [...originalPageLinks];

    const simulation = d3
      .forceSimulation<Node>(originalPageNodes)
      .force('link', d3.forceLink().links(linksClone).distance(50))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('charge', d3.forceManyBody().strength(-500))
      .force(
        'collision',
        d3.forceCollide<Node>().radius((node) => node.radius)
      );

    // update state on every frame
    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    // copy nodes into simulation
    simulation.nodes([...originalPageNodes]);

    simulation.alpha(0.5).restart();

    // stop simulation on unmount
    return () => simulation.stop();
  }, [originalPageLinks, originalPageLinks, width, height]);

  return (
    <div ref={ref} className="h-full w-full">
      <svg className="w-full h-full">
        {originalPageLinks.map((link) => {
          const source = animatedNodes[link.source];
          const target = animatedNodes[link.target];

          if (source && target) {
            return (
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="gray"
                opacity={0.4}
              />
            );
          }
        })}
        {animatedNodes.map((node) => {
          const page = pages.find((page) => page.id === node.id);

          return (
            <Link href={`/page/${page?.id}`}>
              <g className="cursor-pointer">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  key={node.index}
                  stroke="black"
                  fill={page?.id === currentPageId ? 'yellow' : 'white'}
                />
                {page && (
                  <text
                    text-anchor="middle"
                    className="text-xs"
                    x={node.x}
                    y={Number(node.y) + 25}
                  >
                    {page.properties.image?.__typename === 'Emoji'
                      ? page.properties.image.emoji
                      : ''}{' '}
                    {page.properties.title.rawText}
                  </text>
                )}
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
};
