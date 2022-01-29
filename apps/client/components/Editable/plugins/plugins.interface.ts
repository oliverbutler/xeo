import { Editor } from 'slate';

export type EditablePlugin = {
  wrapper?: (editor: Editor) => Editor;
  onKeyDown?: (
    editor: Editor,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => void;
};
