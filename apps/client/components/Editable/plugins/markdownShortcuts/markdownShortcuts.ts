import { Editor, Element, Point, Range, Transforms } from 'slate';
import { SlateBlockType, forEventToggleMarks } from '@xeo/utils';
import { EditablePlugin } from '../plugins.interface';

const SHORTCUTS = {
  '*': SlateBlockType.LIST_ITEM,
  '-': SlateBlockType.LIST_ITEM,
  '+': SlateBlockType.LIST_ITEM,
  '>': SlateBlockType.BLOCK_QUOTE,
  '#': SlateBlockType.HEADING_ONE,
  '##': SlateBlockType.HEADING_TWO,
  '###': SlateBlockType.HEADING_THREE,
  '####': SlateBlockType.HEADING_FOUR,
};

type Shortcut = keyof typeof SHORTCUTS;

const isShortcut = (text: string): text is Shortcut => {
  return Object.keys(SHORTCUTS).includes(text);
};

export const getTextTypeFromShortcut = (
  text: string
): SlateBlockType | null => {
  if (!isShortcut(text)) {
    return null;
  }

  return SHORTCUTS[text];
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
