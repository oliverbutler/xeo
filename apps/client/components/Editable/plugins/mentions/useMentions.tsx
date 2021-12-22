import { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { Page, useGetPageGraphQuery } from 'generated';
import { BaseRange, Descendant, Editor, Transforms, Range } from 'slate';
import {
  emptySlateText,
  isMentionElement,
  MentionElement,
  SlateBlockType,
} from '@xeo/utils';
import { EditablePlugin } from '../plugins.interface';

interface Output {
  mentionPlugin: EditablePlugin;
  mentionOnChange: (editor: Editor, _values: Descendant[]) => void;
  options: Pick<Page, 'id' | 'emoji' | 'titlePlainText'>[];
  selectedIndex: number;
  targetRange: BaseRange | undefined;
}

interface Input {
  onMentionCreate: (editor: Editor, pageId: string) => void;
  onMentionRemove: (editor: Editor, pageId: string) => void;
  handleAddNewMention?: (
    editor: Editor,
    searchString: string
  ) => Promise<{ pageId: string } | undefined>;
}

export const useMentions = ({
  onMentionCreate,
  onMentionRemove,
  handleAddNewMention,
}: Input): Output => {
  const { data } = useGetPageGraphQuery();

  const [target, setTarget] = useState<BaseRange | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const [fuseInstance, setFuseInstance] = useState<
    Fuse<Pick<Page, 'id' | 'emoji' | 'titlePlainText'>> | undefined
  >();

  const [options, setOptions] = useState<
    Pick<Page, 'id' | 'emoji' | 'titlePlainText'>[]
  >([]);

  useEffect(() => {
    if (data?.pages) {
      const fuse = new Fuse(data.pages, {
        keys: ['titlePlainText'],
        includeScore: true,
        useExtendedSearch: true,
      });
      setFuseInstance(fuse);
    }
  }, [data]);

  useEffect(() => {
    if (fuseInstance && search) {
      const result = fuseInstance.search(search);
      setOptions(
        result.filter((x) => x?.score && x.score <= 0.03).map((x) => x.item)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
      apply(operation);

      if (
        operation.type === 'insert_node' &&
        isMentionElement(operation.node)
      ) {
        onMentionCreate(editor, operation.node.pageId);
      }

      if (
        operation.type === 'remove_node' &&
        isMentionElement(operation.node)
      ) {
        onMentionRemove(editor, operation.node.pageId);
      }
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
    async (editor: Editor, event: React.KeyboardEvent<HTMLDivElement>) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const prevIndex = index >= options.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const nextIndex = index <= 0 ? options.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);

            if (options[index]) {
              insertMention(editor, options[index].id);
            } else if (handleAddNewMention) {
              const result = await handleAddNewMention(editor, search);
              if (result) {
                insertMention(editor, result.pageId);
              }
            }
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

  const mentionOnChange = (editor: Editor, _values: Descendant[]) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
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
  };

  return {
    mentionPlugin: { onKeyDown, wrapper: withMentions },
    mentionOnChange,
    options,
    selectedIndex: index,
    targetRange: target,
  };
};
