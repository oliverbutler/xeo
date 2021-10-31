import { BlockType, PageChildren_TextBlock_Fragment } from 'generated';
import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  block: PageChildren_TextBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const [text, setText] = React.useState(block.text ?? '');

  const handleChange = (e: ContentEditableEvent) => {
    setText(e.target.value);
  };

  switch (block.type) {
    case BlockType.Text:
      return (
        <ContentEditable
          className="text-left px-1 py-0.5"
          html={text}
          onChange={handleChange}
        />
      );
    case BlockType.Heading_1:
      return (
        <ContentEditable
          className="text-left px-1 py-0.5 text-xl font-semibold"
          tagName="h1"
          html={text}
          onChange={handleChange}
        />
      );
    default:
      return null;
  }
};
