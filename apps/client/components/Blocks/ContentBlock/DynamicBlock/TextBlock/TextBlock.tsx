import classNames from 'classnames';
import { Editable } from 'components/Editable/Editable';
import { HeadingType, PageChildren_ContentBlock_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useState } from 'react';

interface Props {
  block: PageChildren_ContentBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const [text, setText] = useState(block.properties.text.rawText);

  const debouncedText = useDebounce(text, 500);

  const { updateBlock } = useBlock();

  useEffect(() => {
    if (debouncedText !== block.properties.text.rawText) {
      updateBlock({
        variables: {
          id: block.id,
          input: {
            text: {
              rawText: text,
            },
          },
        },
      });
    }
  }, [debouncedText, block]);

  switch (block.properties.__typename) {
    case 'ParagraphProperties':
      return (
        <Editable
          className="text-left px-1 py-0.5"
          html={text}
          onChange={(e) => setText(e.target.value)}
        />
      );
    case 'HeadingProperties':
      return (
        <Editable
          className={classNames('text-left px-1 py-0.5 font-semibold', {
            'text-3xl': block.properties.variant === HeadingType.H1,
            'text-2xl': block.properties.variant === HeadingType.H2,
            'text-lg': block.properties.variant === HeadingType.H3,
          })}
          tagName={block.properties.variant.toLowerCase()}
          html={text}
          onChange={(e) => setText(e.target.value)}
        />
      );
    default:
      return null;
  }
};
