import { Editor, Transforms } from 'slate';
import { EditablePlugin } from '../plugins.interface';

const withSingleLine = (editor: Editor): Editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export const singleLine: EditablePlugin = {
  wrapper: withSingleLine,
};
