import { BaseEditor, Descendant, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlateBlockType } from './slate.interface';

export const serializeToString = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

type CustomElement = { type: SlateBlockType; children: CustomText[] };
type CustomText = { text: string };

export type SlateValue = Descendant[];

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

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
