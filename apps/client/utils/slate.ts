import { Node } from 'slate';

export const serializeToString = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n');
};
