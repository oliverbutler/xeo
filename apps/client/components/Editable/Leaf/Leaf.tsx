import { RenderLeafProps } from 'slate-react';

export const Leaf: React.FunctionComponent<RenderLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  if (leaf.strikeThrough) {
    children = <del {...attributes}>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};
