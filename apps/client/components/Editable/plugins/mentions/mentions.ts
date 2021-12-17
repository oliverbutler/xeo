import { Page } from 'generated';
import { Editor, Transforms } from 'slate';
import { CustomElement, emptySlateText, SlateBlockType } from '@xeo/utils';
import { EditablePlugin } from '../plugins.interface';

const insertPageMention = (editor: Editor, pageId: Page['id']): void => {
  const mention: CustomElement = {
    type: SlateBlockType.MENTION_PAGE,
    pageId,
    children: [{ text: '', ...emptySlateText }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const withMentions = (editor: Editor): Editor => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === SlateBlockType.MENTION_PAGE
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === SlateBlockType.MENTION_PAGE
      ? true
      : isVoid(element);
  };

  return editor;
};

export const mentions: EditablePlugin = {
  wrapper: withMentions,
};
