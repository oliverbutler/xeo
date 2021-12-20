import { Page } from 'generated';
import { Editor, Transforms, Range } from 'slate';
import { CustomElement, emptySlateText, SlateBlockType } from '@xeo/utils';
import { EditablePlugin } from '../plugins.interface';
import React from 'react';

const insertPageMention = (editor: Editor, pageId: Page['id']): void => {
  const mention: CustomElement = {
    type: SlateBlockType.MENTION_PAGE,
    pageId,
    children: [{ ...emptySlateText, text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const withMentions = (editor: Editor): Editor => {
  const { isVoid, isInline, insertText } = editor;

  editor.isVoid = (element) => {
    return element.type === SlateBlockType.MENTION_PAGE
      ? true
      : isVoid(element);
  };

  editor.isInline = (element) => {
    return element.type === SlateBlockType.MENTION_PAGE
      ? true
      : isInline(element);
  };

  return editor;
};

const onKeyDown = (
  editor: Editor,
  event: React.KeyboardEvent<HTMLDivElement>
) => {
  if (!editor.selection) {
    return;
  }

  const [start] = Range.edges(editor.selection);
  const wordBefore = Editor.before(editor, start, { unit: 'word' });
  const before = wordBefore && Editor.before(editor, wordBefore);
  const beforeRange = before && Editor.range(editor, before, start);
  const beforeText = beforeRange && Editor.string(editor, beforeRange);
  const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);

  console.log(beforeText, beforeMatch);

  if (beforeMatch && event.key === 'Enter') {
    event.preventDefault();
    insertPageMention(editor, beforeMatch[1]);

    // Delete the beforeMatch text
    Transforms.delete(editor, { at: beforeRange });
  }
};

export const mentions: EditablePlugin = {
  wrapper: withMentions,
  onKeyDown,
};
