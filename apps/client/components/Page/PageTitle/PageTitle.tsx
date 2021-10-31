import classNames from 'classnames';
import { client } from 'components/Wrappers/ApolloWrapper';
import { GetBlockQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  page: GetBlockQuery['block'];
}

export const PageTitle: React.FunctionComponent<Props> = ({ page }) => {
  if (page.__typename !== 'PageBlock') {
    return null;
  }

  const text = useRef(page.title || 'Untitled');

  const { updateBlock } = useBlock();

  const handleChange = (e: ContentEditableEvent) => {
    text.current = e.target.value;
  };

  const handleBlur = async () => {
    if (page.title !== text.current) {
      await updateBlock({
        variables: { blockId: page.id, data: { title: text.current } },
      });
    }
  };

  return (
    <ContentEditable
      tagName="h1"
      html={text.current}
      className={classNames('text-4xl font-bold text-left mb-10', {
        'text-gray-300': !page.title,
      })}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
