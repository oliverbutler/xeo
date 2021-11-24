import classNames from 'classnames';
import { BlockVariant, PageBlockFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useMemo, useState } from 'react';
import { createEditor, BaseEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { serializeToString } from 'utils/slate';

interface Props {
  block: PageBlockFragment;
}

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

export type SlateValue = Descendant[];

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const { updateTextBlock, deleteBlock, createTextBlock } = useBlock();

  const [value, setValue] = useState<Descendant[]>(JSON.parse(block.richText));

  const debouncedValue = useDebounce(value, 500);

  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    if (serializeToString(debouncedValue) !== block.rawText) {
      updateTextBlock(block.id, {
        richText: JSON.stringify(debouncedValue),
        rawText: serializeToString(debouncedValue),
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    //
  }, [block]);

  // const handleBlockCreation = async () => {
  //   const result = await createTextBlock({
  //     parentPageId: block.parentId,
  //     properties: {
  //       text: emptyRichTextInput,
  //     },
  //   });

  //   const paragraph = result.data?.createParagraphBlock;

  //   if (!paragraph) return;

  //   await moveFocusToBlock(paragraph.id);
  // };

  const getClassNames = () => {
    switch (block.variant) {
      case BlockVariant.Heading_1:
        return 'font-semibold text-3xl';
      case BlockVariant.Heading_2:
        return 'font-semibold text-2xl';
      case BlockVariant.Heading_3:
        return 'font-semibold text-lg';
      default:
        return 'px-1 py-0.5';
    }
  };

  console.log(value);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable className={classNames('text-left', getClassNames())} />
    </Slate>
  );
};
