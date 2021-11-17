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
  const [animatedNodes, setAnimatedNodes] = useState<Node[]>([]);
  const [pageLinks, setPageLinks] = useState<Link[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const {
    query: { page: pageId },
  } = useRouter();

  const currentPageId = pageId as string;

  const width = ref.current?.offsetWidth ?? 0;
  const height = ref.current?.offsetHeight ?? 0;

  useEffect(() => {
    const nodes: Node[] = pages.map((page) => ({
      id: page.id,
      radius: 5,
      x: width / 2,
      y: height / 2,
    }));

    const links = pages.map((page) => {
      const source = nodes.findIndex((node) => node.id === page.id);
      const target = nodes.findIndex((node) => node.id === page.parentId);

      return {
        source,
        target: target === -1 ? source : target,
      };
    });

    setAnimatedNodes(nodes);
    setPageLinks(links);
  }, [pages]);

  // @ts-ignore
  useEffect(() => {
    const deepCopyAnimatedNodes = JSON.parse(JSON.stringify(animatedNodes));
    const deepCopyPageLinks = JSON.parse(JSON.stringify(pageLinks));

    const simulation = d3
      .forceSimulation<Node>(deepCopyAnimatedNodes)
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('charge', d3.forceManyBody().strength(-500))
      .force(
        'collision',
        d3.forceCollide<Node>().radius((node) => node.radius)
      )
      .force('link', d3.forceLink().links(deepCopyPageLinks).distance(50));

    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    simulation.alpha(0.5).alphaMin(0.05).restart();

    return () => simulation.stop();
  }, [pages, width, height]);

  return (
    <div ref={ref} className="h-full w-full">
      <svg className="w-full h-full">
        {pageLinks.map((link) => {
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
                key={`link-${link.source}-${link.target}`}
              />
            );
          }
        })}
        {animatedNodes.map((node) => {
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
