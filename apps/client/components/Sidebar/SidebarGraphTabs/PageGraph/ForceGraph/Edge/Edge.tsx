import { Node } from '../ForceGraph.interface';

interface EdgeProps {
  source: Node;
  target: Node;
}

export const Edge: React.FunctionComponent<EdgeProps> = ({
  source,
  target,
}) => {
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
};
