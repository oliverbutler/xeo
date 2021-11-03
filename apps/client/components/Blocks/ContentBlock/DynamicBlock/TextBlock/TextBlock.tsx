import classNames from 'classnames';
import { HeadingType, PageChildren_ContentBlock_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import React, { useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  block: PageChildren_ContentBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const blockText = block.properties.text.rawText;

  const textRef = useRef<string>(blockText ?? '');

  const { updateBlock } = useBlock();

  const handleChange = (e: ContentEditableEvent) => {
    textRef.current = e.target.value;
  };

  const handleBlur = () => {
    if (textRef.current !== blockText) {
      updateBlock({
        variables: {
          id: block.id,
          input: {
            text: {
              rawText: textRef.current,
            },
          },
        },
      });
    }
  };

  switch (block.properties.__typename) {
    case 'ParagraphProperties':
      return (
        <ContentEditable
          className="text-left px-1 py-0.5"
          html={textRef.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );
    case 'HeadingProperties':
      return (
        <ContentEditable
          className={classNames('text-left px-1 py-0.5 font-semibold', {
            'text-3xl': block.properties.variant === HeadingType.H1,
            'text-2xl': block.properties.variant === HeadingType.H2,
            'text-lg': block.properties.variant === HeadingType.H3,
          })}
          tagName={block.properties.variant.toLowerCase()}
          html={textRef.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );
    default:
      return null;
  }
};
