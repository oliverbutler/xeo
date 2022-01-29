import {
  Slate,
  Editable as SlateEditable,
  withReact,
  ReactEditor,
} from 'slate-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf } from './Leaf/Leaf';
import { Element } from './Element/Element';
import { markdownShortcuts } from './plugins/markdownShortcuts/markdownShortcuts';
import { EditablePlugin } from './plugins/plugins.interface';
import { singleLine } from './plugins/singleLine/singleLine';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

import { usePageLink } from 'hooks/usePageLink/usePageLink';
import { usePageContext } from 'context/PageContext';
import { MentionSelection } from './plugins/mentions/MentionSelection';
import { useBlock } from 'hooks/useBlock/useBlock';
import { useMentions } from './plugins/mentions/useMentions';
import { lineBehaviour } from './plugins/lineBehaviour/lineBehaviour';

export const Portal: React.FunctionComponent = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  restrictToSingleLine?: boolean;
  className?: string;
  placeholder?: string;
  pageId: string;
  field: 'body' | 'title';
}

export const Editable: React.FunctionComponent<Props> = ({
  value,
  onChange,
  restrictToSingleLine = false,
  placeholder = 'Write some text...',
  className,
  field,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const { fetchOrUpsertPageLink, removePageLink } = usePageLink();
  const { currentPageId } = usePageContext();
  const { createPage } = useBlock();

  const [position, setPosition] = useState({ top: '0px', left: '0px' });

  const {
    mentionPlugin,
    mentionOnChange,
    options,
    selectedIndex,
    targetRange,
  } = useMentions({
    onMentionCreate: (editor, pageId) => {
      if (currentPageId) {
        fetchOrUpsertPageLink(currentPageId, pageId, currentPageId, {
          ...(field == 'body' && { body: editor.children }),
          ...(field == 'title' && { title: editor.children }),
        });
      }
    },
    onMentionRemove: (editor, pageId) => {
      if (currentPageId) {
        removePageLink(currentPageId, pageId, currentPageId, {
          ...(field == 'body' && { body: editor.children }),
          ...(field == 'title' && { title: editor.children }),
        });
      }
    },
    handleAddNewMention: async (editor, searchString) => {
      const newPage = await createPage({ titlePlainText: searchString });

      return newPage.data ? { pageId: newPage.data.createPage.id } : undefined;
    },
  });

  const plugins: EditablePlugin[] = [
    lineBehaviour,
    markdownShortcuts,
    mentionPlugin,
  ];

  if (restrictToSingleLine) {
    plugins.push(singleLine);
  }

  const editorRef = useRef<Editor>();
  if (!editorRef.current)
    editorRef.current = plugins.reduce(
      (editor, plugin) => plugin.wrapper?.(editor) ?? editor,
      withHistory(withReact(createEditor()))
    );
  const editor = editorRef.current;

  useEffect(() => {
    if (targetRange && options.length > 0) {
      const domRange = ReactEditor.toDOMRange(editor, targetRange);
      const rect = domRange.getBoundingClientRect();
      setPosition({
        top: `${rect.top + window.pageYOffset + 24}px`,
        left: `${rect.left + window.pageXOffset}px`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length, targetRange]);

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          onChange(value);
          mentionOnChange(editor, value);
        }}
      >
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
        ></SlateEditable>
        {targetRange && (
          <MentionSelection
            position={position}
            options={options.map((x) => `${x.emoji} ${x.titlePlainText}`)}
            selectedIndex={selectedIndex}
          />
        )}
      </Slate>
    </div>
  );
};
