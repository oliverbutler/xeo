import isHotkey from 'is-hotkey';
import { Editor } from 'slate';
import { EditablePlugin } from '../plugins.interface';

const onKeyDown = (
  editor: Editor,
  event: React.KeyboardEvent<HTMLDivElement>
) => {
  const blockAbove = Editor.above(editor);

  if (!blockAbove) {
    return;
  }

  if (isHotkey('shift+enter', event)) {
    event.preventDefault();
    editor.insertText('\n');
  }
};

export const lineBehaviour: EditablePlugin = {
  onKeyDown,
};
