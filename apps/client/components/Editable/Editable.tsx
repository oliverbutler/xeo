import { Slate, Editable as SlateEditable, withReact } from 'slate-react';
import React, { useCallback, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';

import { Leaf } from './Leaf/Leaf';
import { Element } from './Element/Element';
import { markdownShortcuts } from './plugins/markdownShortcuts/markdownShortcuts';
import { EditablePlugin } from './plugins/plugins.interface';

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export const Editable: React.FunctionComponent<Props> = ({
  value,
  onChange,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const plugins: EditablePlugin[] = [markdownShortcuts];

  const editor = useMemo(
    () =>
      plugins.reduce(
        (editor, plugin) => plugin.wrapper(editor),
        withReact(createEditor())
      ),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <SlateEditable
        className={'text-left px-1 py-0.5'}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
        onKeyDown={(event) => {
          plugins.forEach((plugin) => plugin.onKeyDown?.(editor, event));
        }}
        placeholder="Write some text..."
        spellCheck
        autoFocus
      />
    </Slate>
  );
};
