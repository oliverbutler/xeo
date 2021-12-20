import classNames from 'classnames';
import { useGetPageQuery } from 'generated';
import Link from 'next/link';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { MentionElement } from '@xeo/utils';

export const Mention: React.FunctionComponent<
  RenderElementProps & { element: MentionElement }
> = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  const { data } = useGetPageQuery({
    variables: { id: element.pageId },
  });

  const page = data?.page;

  return (
    <Link href={`/page/${element.pageId}`} passHref>
      <span
        {...attributes}
        contentEditable={false}
        data-cy={`mention-${element.pageId?.replace(' ', '-')}`}
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
