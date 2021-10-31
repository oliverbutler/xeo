import { BlockType, PageChildren_TextBlock_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import React, { useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  block: PageChildren_TextBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const textRef = useRef<string>(block.text ?? '');

  const { updateBlock } = useBlock();

  const handleChange = (e: ContentEditableEvent) => {
    textRef.current = e.target.value;
  };

  const handleBlur = () => {
    if (textRef.current !== block.text) {
      updateBlock({
        variables: { blockId: block.id, data: { text: textRef.current } },
      });
    }
  };

  switch (block.type) {
    case BlockType.Text:
      return (
        <ContentEditable
          className="text-left px-1 py-0.5"
          html={textRef.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );
    case BlockType.Heading_1:
      return (
        <ContentEditable
          className="text-left px-1 py-0.5 text-xl font-semibold"
          tagName="h1"
          html={textRef.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );
    default:
      return null;
  }
};
