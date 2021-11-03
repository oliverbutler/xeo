import classNames from 'classnames';
import { Editable } from 'components/Editable/Editable';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import { useEffect, useState } from 'react';

interface Props {
  page: GetPageQuery['page'];
}

export const PageTitle: React.FunctionComponent<Props> = ({ page }) => {
  const [text, setText] = useState(page.properties.title.rawText);

  const debouncedText = useDebounce(text, 500);

  const { updatePage } = useBlock();

  useEffect(() => {
    if (debouncedText !== page.properties.title.rawText) {
      updatePage({
        variables: {
          id: page.id,
          input: { title: { rawText: debouncedText } },
        },
      });
    }
  }, [debouncedText, page]);

  return (
    <Editable
      tagName="h1"
      html={text}
      className={classNames('text-4xl font-bold text-left mb-10', {
        'text-gray-300': !text,
      })}
      onChange={(e) => setText(e.target.value)}
    />
  );
};
