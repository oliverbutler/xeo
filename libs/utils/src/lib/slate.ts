import { BaseEditor, Descendant, Editor, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { isHotkey } from 'is-hotkey';

export enum SlateBlockType {
  PARAGRAPH = 'paragraph',
  LIST_ITEM = 'list-item',
  BULLET_LIST = 'bulleted-list',
  BLOCK_QUOTE = 'block-quote',
  HEADING_ONE = 'heading-one',
  HEADING_TWO = 'heading-two',
  HEADING_THREE = 'heading-three',
  HEADING_FOUR = 'heading-four',
  HEADING_FIVE = 'heading-five',
  HEADING_SIX = 'heading-six',
  MENTION_PAGE = 'mention-page',
  CALLOUT = 'callout',
}

export enum TextFormat {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  CODE = 'code',
  STRIKE_THROUGH = 'strikeThrough',
}

export const serializeToString = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

export type MentionElement = {
  type: SlateBlockType.MENTION_PAGE;
  pageId: string;
  children: CustomText[];
};

export type CalloutElement = {
  type: SlateBlockType.CALLOUT;
  emoji: string;
  children: CustomText[];
};

export const isNodeElement = (
  element: Node | Path
): element is CustomElement => {
  return (element as CustomElement).type !== undefined;
};

export const isMentionElement = (
  element: Node | Path
): element is MentionElement => {
  return (
    isNodeElement(element) && element?.type === SlateBlockType.MENTION_PAGE
  );
};

export type CustomElement =
  | { type: SlateBlockType; children: CustomText[] }
  | MentionElement
  | CalloutElement;

type CustomText = {
  text: string;
  [TextFormat.BOLD]: boolean;
  [TextFormat.ITALIC]: boolean;
  [TextFormat.UNDERLINE]: boolean;
  [TextFormat.CODE]: boolean;
  [TextFormat.STRIKE_THROUGH]: boolean;
};

export type SlateValue = Descendant[];

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const MARKDOWN_SHORTCUTS = {
  '*': SlateBlockType.LIST_ITEM,
  '-': SlateBlockType.LIST_ITEM,
  '+': SlateBlockType.LIST_ITEM,
  '>': SlateBlockType.BLOCK_QUOTE,
  '#': SlateBlockType.HEADING_ONE,
  '##': SlateBlockType.HEADING_TWO,
  '###': SlateBlockType.HEADING_THREE,
  '####': SlateBlockType.HEADING_FOUR,
  '=': SlateBlockType.CALLOUT,
};

export type MarkdownShortcut = keyof typeof MARKDOWN_SHORTCUTS;

export const HOTKEYS = {
  'mod+b': TextFormat.BOLD,
  'mod+i': TextFormat.ITALIC,
  'mod+u': TextFormat.UNDERLINE,
  'mod+e': TextFormat.CODE,
  'mod+shift+s': TextFormat.STRIKE_THROUGH,
};

export type Hotkey = keyof typeof HOTKEYS;

export const forEventToggleMarks = (
  editor: Editor,
  event: React.KeyboardEvent<HTMLDivElement>
) => {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();

      const mark = HOTKEYS[hotkey as Hotkey];
      toggleMark(editor, mark);
    }
  }
};

export const toggleMark = (editor: Editor, format: TextFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: TextFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const emptySlateText = {
  bold: false,
  italic: false,
  underline: false,
  code: false,
  strikeThrough: false,
};

export const slateStateFactory = (
  text: string,
  type?: SlateBlockType
): SlateValue => {
  return [
    {
      type: type ?? SlateBlockType.PARAGRAPH,
      children: [
        {
          text,
          ...emptySlateText,
        },
      ],
    },
  ];
};
