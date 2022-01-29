import { usePageContext } from 'context/PageContext';
import { GetPageGraphQuery, Page } from 'generated';
import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import { Node as GraphNode } from '../ForceGraph.interface';

interface NodeProps {
  node: GraphNode;
  pageGraph: GetPageGraphQuery;
}

export const Node: React.FunctionComponent<NodeProps> = ({
  node,
  pageGraph,
}) => {
  const { currentPageId } = usePageContext();
  const { theme } = useTheme();

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
  const isActiveNode = page?.id === currentPageId;

  const fillColour = isActiveNode ? 'pink' : isTargeted ? 'white' : 'gray';
  return (
    <NextLink href={`/page/${page?.id}`} key={node.id} passHref={true}>
      <g className="cursor-pointer " opacity={isTargeted ? 1 : 0.5}>
        <circle
          cx={node.x}
          cy={node.y}
          r={isActiveNode ? node.radius * 2 : node.radius}
          stroke="black"
          fill={fillColour}
        />

        <text
          textAnchor="middle"
          className="text-xs"
          fill={isTargeted ? (theme === 'dark' ? 'white' : 'black') : 'gray'}
          x={node.x}
          y={Number(node.y) + 25}
        >
          {page?.emoji} {page?.titlePlainText}
        </text>
      </g>
    </NextLink>
  );
};
