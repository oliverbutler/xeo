import { BlockType, PageChildrenFragment } from 'generated';
import { BlockList } from 'net';
import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

interface Props {
  block: PageChildrenFragment;
}

/**
 * Takes a ContentBlock and displays the appropriate type of Block
 */
export const DynamicBlockRenderer: React.FunctionComponent<Props> = ({
  block,
}) => {
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
    case BlockType.Page:
      return (
        <ContentEditable
          className="text-left px-1 py-0.5"
          html={text}
          onChange={handleChange}
        />
      );
  }
};
