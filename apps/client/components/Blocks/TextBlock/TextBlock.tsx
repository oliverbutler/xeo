import { PageBlockFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEditor,
  Descendant,
  Editor,
  Point,
  Element as SlateElement,
  Range,
  Transforms,
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import {
  getTextTypeFromShortcut,
  serializeToString,
  forEventToggleMarks,
} from 'utils/slate';
import { SlateBlockType } from 'utils/slate.interface';
interface Props {
  block: PageBlockFragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const { updateTextBlock } = useBlock();

  const [value, setValue] = useState<Descendant[]>(JSON.parse(block.richText));

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const debouncedValue = useDebounce(value, 1000);

  const editor = useMemo(() => withShortcuts(withReact(createEditor())), []);

  useEffect(() => {
    if (serializeToString(debouncedValue) !== block.rawText) {
      updateTextBlock(block.id, {
        richText: JSON.stringify(debouncedValue),
        rawText: serializeToString(debouncedValue),
      });
    }
  }, [debouncedValue]);

  // const handleBlockCreation = async () => {
  //   const result = await createTextBlock({
  //     parentPageId: block.parentId,
  //     properties: {
  //       text: emptySlateBlockTypeInput,
  //     },
  //   });

  //   const paragraph = result.data?.createParagraphBlock;

  //   if (!paragraph) return;

  //   await moveFocusToBlock(paragraph.id);
  // };

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        className={'text-left px-1 py-0.5'}
        renderElement={renderElement}
        renderLeaf={(props) => <Leaf {...props} />}
        onKeyDown={(event) => {
          forEventToggleMarks(editor, event);
        }}
        placeholder="Write some text..."
        spellCheck
        autoFocus
      />
    </Slate>
  );
};

const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      const type = getTextTypeFromShortcut(beforeText);

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        const newProperties: Partial<SlateElement> = {
          type,
        };
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        });

        if (type === SlateBlockType.LIST_ITEM) {
          const list = {
            type: SlateBlockType.BULLET_LIST,
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === SlateBlockType.LIST_ITEM,
          });
        }
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== SlateBlockType.PARAGRAPH &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: SlateBlockType.PARAGRAPH,
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === SlateBlockType.LIST_ITEM) {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === SlateBlockType.BULLET_LIST,
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  if (leaf.strikeThrough) {
    children = <del {...attributes}>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          className="text-gray-300 border-l-2 pl-2 my-1"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul className="list-disc ml-6 " {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 className="font-semibold text-3xl" {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className="font-semibold text-2xl" {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 className="font-semibold text-lg" {...attributes}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 className="font-semibold text-xl" {...attributes}>
          {children}
        </h4>
      );
    case 'list-item':
      return (
        <li className="" {...attributes}>
          {children}
        </li>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
