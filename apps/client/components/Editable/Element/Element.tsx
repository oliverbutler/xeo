import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { MentionElement, SlateBlockType } from '@xeo/utils';
import { Mention } from './Mention/Mention';

export const Element: React.FunctionComponent<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case SlateBlockType.BLOCK_QUOTE:
      return (
        <blockquote
          className="border-l-2 border-dark-800 dark:border-dark-600 pl-2 my-1 italic"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case SlateBlockType.BULLET_LIST:
      return (
        <ul className="list-disc ml-6 " {...attributes}>
          {children}
        </ul>
      );
    case SlateBlockType.HEADING_ONE:
      return (
        <h1 className="font-semibold text-3xl" {...attributes}>
          {children}
        </h1>
      );
    case SlateBlockType.HEADING_TWO:
      return (
        <h2 className="font-semibold text-2xl" {...attributes}>
          {children}
        </h2>
      );
    case SlateBlockType.HEADING_THREE:
      return (
        <h3 className="font-semibold text-lg" {...attributes}>
          {children}
        </h3>
      );
    case SlateBlockType.HEADING_FOUR:
      return (
        <h4 className="font-semibold text-xl" {...attributes}>
          {children}
        </h4>
      );
    case SlateBlockType.LIST_ITEM:
      return (
        <li className="" {...attributes}>
          {children}
        </li>
      );
    case SlateBlockType.MENTION_PAGE:
      // eslint-disable-next-line no-case-declarations
      const mentionProps = {
        ...props,
        element: props.element as MentionElement,
      };
      return <Mention {...mentionProps} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
