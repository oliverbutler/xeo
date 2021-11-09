import classNames from 'classnames';
import { Editable } from 'components/Editable/Editable';
import { HeadingType, PageChildren_ContentBlock_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import { moveFocusToBlock, moveFocusToPreviousBlock } from '../helpers/block';

interface Props {
  block: PageChildren_ContentBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const [text, setText] = useState(block.properties.text.rawText);

  const debouncedText = useDebounce(text, 500);

  const { updateBlock, createParagraphBlock, deleteBlock } = useBlock();

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

  const handleOnKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    // Allow shift + enter to add a new line
    if (event.key === 'Enter' && event.shiftKey) {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const result = await createParagraphBlock({
        parentId: block.parentId,
        afterId: block.id,
        properties: { text: { rawText: '' } },
      });

      const paragraph = result.data?.createParagraphBlock;

      if (!paragraph) return;

      await moveFocusToBlock(paragraph.id);
    }

    if (event.key === 'Backspace' && text === '') {
      event.preventDefault();

      await deleteBlock(block.id);

      await moveFocusToPreviousBlock(block.id);
    }
  };

  switch (block.properties.__typename) {
    case 'ParagraphProperties':
      return (
        <Editable
          onKeyDown={handleOnKeyDown}
          className="px-1 py-0.5"
          html={text}
          onChange={(e) => setText(e.target.value)}
        />
      );
    case 'HeadingProperties':
      return (
        <Editable
          onKeyDown={handleOnKeyDown}
          className={classNames('px-1 py-0.5 font-semibold', {
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
