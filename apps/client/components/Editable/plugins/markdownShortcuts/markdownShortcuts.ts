import { Editor, Element, Point, Range, Transforms } from 'slate';
import {
  SlateBlockType,
  forEventToggleMarks,
  MarkdownShortcut,
  MARKDOWN_SHORTCUTS,
  CalloutElement,
  emptySlateText,
} from '@xeo/utils';
import { EditablePlugin } from '../plugins.interface';

const isShortcut = (text: string): text is MarkdownShortcut => {
  return Object.keys(MARKDOWN_SHORTCUTS).includes(text);
};

export const getTextTypeFromShortcut = (
  text: string
): SlateBlockType | null => {
  if (!isShortcut(text)) {
    return null;
  }

  return MARKDOWN_SHORTCUTS[text];
};

const withMarkdownShortcuts = (editor: Editor): Editor => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      const type = getTextTypeFromShortcut(beforeText);

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);

        const newProperties: Partial<Element> = {
          type,
        };
        Transforms.setNodes<Element>(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        });

        if (type === SlateBlockType.LIST_ITEM) {
          const list = {
            type: SlateBlockType.BULLET_LIST,
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              n.type === SlateBlockType.LIST_ITEM,
          });
        }

        if (type === SlateBlockType.CALLOUT) {
          const newProperties: CalloutElement = {
            type: SlateBlockType.CALLOUT,
            emoji: '🌟',
            children: [{ text: '', ...emptySlateText }],
          };
          Transforms.setNodes<Element>(editor, newProperties, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              n.type === SlateBlockType.CALLOUT,
          });
        }

        // don't insert the " " here
        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          block.type !== SlateBlockType.PARAGRAPH &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<Element> = {
            type: SlateBlockType.PARAGRAPH,
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === SlateBlockType.LIST_ITEM) {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                n.type === SlateBlockType.BULLET_LIST,
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

export const markdownShortcuts: EditablePlugin = {
  wrapper: withMarkdownShortcuts,
  onKeyDown: (editor, event) => forEventToggleMarks(editor, event),
};
