import { convertToRaw, EditorState } from 'draft-js';
import { RichTextInput } from 'generated';

export const emptyContentStateString = JSON.stringify(
  convertToRaw(EditorState.createEmpty().getCurrentContent())
);

export const emptyRichTextInput: RichTextInput = {
  rawText: '',
  content: emptyContentStateString,
};
