import {
  Slate,
  Editable as SlateEditable,
  withReact,
  ReactEditor,
} from 'slate-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createEditor, Descendant, Transforms, Range, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { Leaf } from './Leaf/Leaf';
import { Element } from './Element/Element';
import { markdownShortcuts } from './plugins/markdownShortcuts/markdownShortcuts';
import { EditablePlugin } from './plugins/plugins.interface';
import { singleLine } from './plugins/singleLine/singleLine';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import {
  emptySlateText,
  isMentionElement,
  isNodeElement,
  MentionElement,
  SlateBlockType,
} from '@xeo/utils';
import { useGetPageGraphQuery } from 'generated';
import { usePageLink } from 'hooks/usePageLink/usePageLink';
import { usePageContext } from 'context/PageContext';

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
}

export const Editable: React.FunctionComponent<Props> = ({
  value,
  onChange,
  restrictToSingleLine = false,
  placeholder = 'Write some text...',
  className,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const plugins: EditablePlugin[] = [markdownShortcuts];

  if (restrictToSingleLine) {
    plugins.push(singleLine);
  }

  const { data } = useGetPageGraphQuery();

  const ref = useRef<HTMLDivElement | null>();
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const { fetchOrUpsertPageLink, removePageLink } = usePageLink();
  const { currentPageId } = usePageContext();

  const options = data?.pages ?? [];

  const chars = options
    .filter((c) =>
      c.titlePlainText.toLowerCase().startsWith(search.toLowerCase())
    )
    .slice(0, 10);

  const withMentions = (editor: Editor) => {
    const { isInline, isVoid, apply, normalizeNode } = editor;

    editor.isInline = (element) => {
      return element.type === SlateBlockType.MENTION_PAGE
        ? true
        : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === SlateBlockType.MENTION_PAGE
        ? true
        : isVoid(element);
    };

    editor.apply = (operation) => {
      if (
        operation.type === 'insert_node' &&
        isMentionElement(operation.node) &&
        currentPageId
      ) {
        fetchOrUpsertPageLink(currentPageId, operation.node.pageId);
      }

      if (
        operation.type === 'remove_node' &&
        isMentionElement(operation.node) &&
        currentPageId
      ) {
        removePageLink(currentPageId, operation.node.pageId);
      }

      apply(operation);
    };

    return editor;
  };

  const insertMention = (editor: Editor, character: string) => {
    const mention: MentionElement = {
      type: SlateBlockType.MENTION_PAGE,
      pageId: character,
      children: [{ ...emptySlateText, text: '' }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  };

  const onKeyDown = useCallback(
    (event) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index].id);
            setTarget(undefined);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(undefined);
            break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, search, target]
  );

  const editor = useMemo(
    () =>
      plugins.reduce(
        (editor, plugin) => plugin.wrapper(editor),
        withMentions(withHistory(withReact(createEditor())))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars.length, target]);

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          onChange(value);
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(undefined);
        }}
      >
        <SlateEditable
          className={classNames('text-left px-1 py-0.5', className)}
          renderElement={renderElement}
          renderLeaf={(props) => <Leaf {...props} />}
          onKeyDown={(event) => {
            onKeyDown(event);
            plugins.forEach((plugin) => plugin.onKeyDown?.(editor, event));
          }}
          placeholder={placeholder}
          spellCheck
          autoFocus
        ></SlateEditable>
      </Slate>
      {target && (
        <div
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={ref}
          className="fixed z-50 bg-dark-800"
          data-cy="mentions-portal"
        >
          {chars.map((char, i) => (
            <div
              key={char.id}
              className={classNames('p-1', { 'bg-dark-600': i === index })}
            >
              {char.emoji} {char.titlePlainText}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
