import { Slate, Editable as SlateEditable, withReact } from 'slate-react';
import React, { useCallback, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf } from './Leaf/Leaf';
import { Element } from './Element/Element';
import { markdownShortcuts } from './plugins/markdownShortcuts/markdownShortcuts';
import { EditablePlugin } from './plugins/plugins.interface';
import { singleLine } from './plugins/singleLine/singleLine';
import classNames from 'classnames';
import { mentions } from './plugins/mentions/mentions';

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  restrictToSingleLine?: boolean;
  className?: string;
  placeholder?: string;
}

export const Editable: React.FunctionComponent<Props> = ({
  value,
  onChange,
  restrictToSingleLine = false,
  placeholder = 'Write some text...',
  className,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const plugins: EditablePlugin[] = [markdownShortcuts, mentions];

  if (restrictToSingleLine) {
    plugins.push(singleLine);
  }

  const editor = useMemo(
    () =>
      plugins.reduce(
        (editor, plugin) => plugin.wrapper(editor),
        withHistory(withReact(createEditor()))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <SlateEditable
        className={classNames('text-left px-1 py-0.5', className)}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
        onKeyDown={(event) => {
          plugins.forEach((plugin) => plugin.onKeyDown?.(editor, event));
        }}
        placeholder={placeholder}
        spellCheck
        autoFocus
      />
    </Slate>
  );
};
