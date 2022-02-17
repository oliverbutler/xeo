import classNames from 'classnames';
import { useGetPageQuery } from 'generated';
import Link from 'next/link';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { MentionElement } from '@xeo/utils';
import { ConditionalWrapper } from '@xeo/ui';

export const Mention: React.FunctionComponent<
  RenderElementProps & { element: MentionElement }
> = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  const { data } = useGetPageQuery({
    variables: { id: element.pageId },
  });

  const page = data?.page;

  const text = page
    ? (page.emoji ? `${page.emoji} ` : '') + page.titlePlainText
    : '404';

  return (
    <ConditionalWrapper
      condition={!!page}
      wrapper={(children) => (
        <Link href={`/page/${element.pageId}`} passHref>
          {children}
        </Link>
      )}
    >
      <span {...attributes}>
        <span
          contentEditable={false}
          data-cy={`mention-${element.pageId?.replace(' ', '-')}`}
          className={classNames(
            'select-none dark:bg-dark-800 bg-dark-100 hover:dark:bg-dark-600 hover:bg-dark-200 py-0.5 px-1 rounded-sm cursor-pointer m-1 ',
            {
              'dark:bg-dark-600 bg-dark-200': selected && focused,
              'dark:bg-red-600/20 bg-red-200': !page,
              'cursor-not-allowed': !page,
            }
          )}
        >
          {text}
        </span>
        {children}
      </span>
    </ConditionalWrapper>
  );
};
