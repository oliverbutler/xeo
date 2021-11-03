import classNames from 'classnames';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  page: GetPageQuery['page'];
}

export const PageTitle: React.FunctionComponent<Props> = ({ page }) => {
  const pageTitle = page.properties.title.rawText;
  const text = useRef(pageTitle || 'Untitled');

  const { updatePage } = useBlock();

  const handleChange = (e: ContentEditableEvent) => {
    text.current = e.target.value;
  };

  const handleBlur = async () => {
    if (pageTitle !== text.current) {
      await updatePage({
        variables: { id: page.id, input: { title: { rawText: text.current } } },
      });
    }
  };

  return (
    <ContentEditable
      tagName="h1"
      html={text.current}
      className={classNames('text-4xl font-bold text-left mb-10', {
        'text-gray-300': !pageTitle,
      })}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
