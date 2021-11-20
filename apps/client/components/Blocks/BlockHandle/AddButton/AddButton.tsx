import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import {
  FiAlignLeft,
  FiDatabase,
  FiFile,
  FiPlus,
  FiType,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { HeadingType, PageChildrenFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { moveFocusToBlock } from '../../DynamicBlock/helpers/block';
import { convertToRaw, EditorState } from 'draft-js';
import { emptyContentStateString, emptyRichTextInput } from 'utils/draft';

interface Props {
  block: PageChildrenFragment;
}

export const AddButton: React.FunctionComponent<Props> = ({ block }) => {
  const {
    createHeadingBlock,
    createParagraphBlock,
    createPage,
    createDatabase,
  } = useBlock();

  const handleAddParagraphBlock = async () => {
    const result = await createParagraphBlock({
      parentId: block.parentId,
      afterId: block.id,
      properties: {
        text: emptyRichTextInput,
      },
    });

    if (result.data?.createParagraphBlock) {
      moveFocusToBlock(result.data.createParagraphBlock.id);
    }
  };

  const handleAddHeadingBlock = async (type: HeadingType) => {
    const result = await createHeadingBlock({
      parentId: block.parentId,
      afterId: block.id,
      properties: {
        text: emptyRichTextInput,
        variant: type,
      },
    });
    if (result.data) {
      moveFocusToBlock(result.data.createHeadingBlock.id);
    }
  };

  const handleAddPage = async () => {
    const result = await createPage({
      parentId: block.parentId,
      afterId: block.id,
      properties: { title: emptyRichTextInput },
    });

    if (result.data) {
      moveFocusToBlock(result.data.createPage.id);
    }
  };

  const handleAddDatabase = async () => {
    const result = await createDatabase({
      parentId: block.parentId,
      afterId: block.id,
      properties: { title: emptyRichTextInput },
    });

    if (result.data) {
      moveFocusToBlock(result.data.createDatabase.id);
    }
  };

  return (
    <Dropdown
      button={
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="my-auto select-none hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 p-0.5 cursor-pointer text-gray-400 stroke-current"
        >
          <FiPlus />
        </motion.div>
      }
      showDirection="right"
      items={[
        [
          {
            text: 'Paragraph',
            logo: <FiAlignLeft />,
            onClick: () => handleAddParagraphBlock(),
          },
        ],
        [
          {
            text: 'Heading 1',
            logo: <FiType />,
            onClick: () => handleAddHeadingBlock(HeadingType.H1),
          },
          {
            text: 'Heading 2',
            logo: <FiType />,
            onClick: () => handleAddHeadingBlock(HeadingType.H2),
          },
          {
            text: 'Heading 3',
            logo: <FiType />,
            onClick: () => handleAddHeadingBlock(HeadingType.H3),
          },
        ],
        [
          {
            text: 'Page',
            logo: <FiFile />,
            onClick: () => handleAddPage(),
          },
          {
            text: 'Database',
            logo: <FiDatabase />,
            onClick: () => handleAddDatabase(),
          },
        ],
      ]}
    />
  );
};
