import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { MentionElement, SlateBlockType } from '@xeo/utils';
import classNames from 'classnames';
import { useGetPageQuery } from 'generated';
import Link from 'next/link';
import { usePageLink } from 'hooks/usePageLink/usePageLink';
import { useEffect } from 'react';
import { usePageContext } from 'context/PageContext';

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
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Mention: React.FunctionComponent<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const selected = useSelected();
  const focused = useFocused();
  const mentioned = element as MentionElement;

  const { data } = useGetPageQuery({
    variables: { id: mentioned.pageId },
  });

  // BUG This may cause a bug, if the currentPageId is changed, and the old pageLink is still loaded
  const { currentPageId } = usePageContext();

  const page = data?.page;

  const { fetchOrUpsertPageLink } = usePageLink();

  useEffect(() => {
    if (currentPageId) {
      fetchOrUpsertPageLink(currentPageId, mentioned.pageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageId, mentioned.pageId]);

  return (
    <Link href={`/page/${mentioned.pageId}`} passHref>
      <span
        {...attributes}
        contentEditable={false}
        data-cy={`mention-${mentioned.pageId?.replace(' ', '-')}`}
        className={classNames(
          'dark:bg-dark-800 bg-dark-100 py-0.5 px-1 rounded-sm cursor-pointer m-1',
          {
            'dark:bg-dark-600 bg-dark-200': selected && focused,
          }
        )}
      >
        {page?.emoji} {page?.titlePlainText}
        {children}
      </span>
    </Link>
  );
};
