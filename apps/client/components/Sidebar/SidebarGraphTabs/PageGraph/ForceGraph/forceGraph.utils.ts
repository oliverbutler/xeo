import { GetPageGraphQuery } from 'generated';
import { Link, Node } from './ForceGraph.interface';

export const syncNodes = (
  pageGraph: GetPageGraphQuery,
  currentNodes: Node[],
  height: number,
  width: number
): {
  nodes: Node[];
  links: Link[];
} => {
  const formattedPages: Node[] = pageGraph.pages.map((page) => ({
    id: page.id,
    radius: 5,
    x: width / 2,
    y: height / 2,
  }));

  const newNodes = Object.fromEntries(
    new Map(formattedPages.map((page) => [page.id, page]))
  );

  const existingNodesWhichStillExistArray = [...currentNodes].filter(
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

  return { nodes, links: newLinks };
};
