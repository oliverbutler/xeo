import classNames from 'classnames';
import { Editable } from 'components/Editable/Editable';
import { PageChildren_Database_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDatabase } from 'hooks/useDatabase';
import { useDebounce } from 'hooks/useDebounce';
import { useEffect, useState } from 'react';

interface Props {
  database: PageChildren_Database_Fragment;
}

export const DatabaseTitle: React.FunctionComponent<Props> = ({ database }) => {
  const originalTitle = database.properties.title.rawText;

  const [text, setText] = useState(originalTitle);

  const debouncedText = useDebounce(text, 500);

  const { updateDatabase } = useDatabase();

  useEffect(() => {
    if (debouncedText !== originalTitle) {
      updateDatabase({
        id: database.id,
        input: { title: { rawText: debouncedText } },
      });
    }
  }, [debouncedText]);

  return (
    <Editable
      tagName="h2"
      html={text}
      placeholder="Untitled"
      className={classNames('text-xl font-bold after:hidden', {
        'text-gray-300': !text,
      })}
      onChange={(e) => setText(e.target.value)}
    />
  );
};
