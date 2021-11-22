import classNames from 'classnames';
import { HeadingType, PageChildren_ContentBlock_Fragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import {
  moveFocusToBlock,
  moveFocusToPreviousBlock,
} from '../DynamicBlock/helpers/block';
import {
  convertFromRaw,
  convertToRaw,
  DraftEditorCommand,
  DraftHandleValue,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { emptyRichTextInput } from 'utils/draft';

interface Props {
  block: PageChildren_ContentBlock_Fragment;
}

export const TextBlock: React.FunctionComponent<Props> = ({ block }) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(block.properties.text.content))
    )
  );

  const debouncedEditorState = useDebounce(editorState, 1000);

  const { updateBlock, createParagraphBlock, deleteBlock } = useBlock();

  useEffect(() => {
    const contentState = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    const rawText = editorState.getCurrentContent().getPlainText();

    if (contentState !== block.properties.text.content) {
      updateBlock({
        variables: {
          id: block.id,
          input: {
            text: {
              rawText: rawText,
              content: contentState,
            },
          },
        },
      });
    }
  }, [debouncedEditorState]);

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(block.properties.text.content))
      )
    );
  }, [block]);

  const handleBlockCreation = async () => {
    const result = await createParagraphBlock({
      parentId: block.parentId,
      afterId: block.id,
      properties: {
        text: emptyRichTextInput,
      },
    });

    const paragraph = result.data?.createParagraphBlock;

    if (!paragraph) return;

    await moveFocusToBlock(paragraph.id);
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    // Handle block deletion
    // if (
    //   command === 'backspace' &&
    //   editorState.getCurrentContent().getPlainText() === ''
    // ) {
    //   deleteBlock(block.id).then(() => {
    //     moveFocusToPreviousBlock(block.id);
    //   });
    //   return 'handled';
    // }

    // Handle block creation
    if (command === 'split-block') {
      handleBlockCreation();
      return 'handled';
    }

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  switch (block.properties.__typename) {
    case 'ParagraphProperties':
      return (
        <div className="px-1 py-0.5">
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      );
    case 'HeadingProperties':
      return (
        <div
          className={classNames('px-1 py-0.5 font-semibold', {
            'text-3xl': block.properties.variant === HeadingType.H1,
            'text-2xl': block.properties.variant === HeadingType.H2,
            'text-lg': block.properties.variant === HeadingType.H3,
          })}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      );
    default:
      return null;
  }
};
