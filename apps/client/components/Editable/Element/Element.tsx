import { RenderElementProps } from 'slate-react';

export const Element: React.FunctionComponent<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          className="text-gray-300 border-l-2 pl-2 my-1"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul className="list-disc ml-6 " {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 className="font-semibold text-3xl" {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className="font-semibold text-2xl" {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 className="font-semibold text-lg" {...attributes}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 className="font-semibold text-xl" {...attributes}>
          {children}
        </h4>
      );
    case 'list-item':
      return (
        <li className="" {...attributes}>
          {children}
        </li>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
