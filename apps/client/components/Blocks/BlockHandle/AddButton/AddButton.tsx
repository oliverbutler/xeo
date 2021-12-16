import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import {
  FiAlignLeft,
  FiDatabase,
  FiFile,
  FiPlus,
  FiType,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BlockVariant, PageBlockFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { moveFocusToBlock } from '../../DynamicBlock/helpers/block';

interface Props {
  block: PageBlockFragment;
}

export const AddButton: React.FunctionComponent<Props> = ({ block }) => {
  const { createEmptyTextBlock, createPage, createDatabase } = useBlock();

  const handleAddEmptyTextBlock = async (variant: BlockVariant) => {
    const result = await createEmptyTextBlock(block.parentPageId, variant);

    if (result.data?.createTextBlock) {
      moveFocusToBlock(result.data.createTextBlock.id);
    }
  };

  const handleAddPage = async () => {
    const result = await createPage({
      titlePlainText: '',
    });
  };

  const handleAddDatabase = async () => {
    const result = await createDatabase({
      richText: JSON.stringify({}),
      rawText: ' ',
      schema: JSON.stringify({}),
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
            onClick: () => handleAddEmptyTextBlock(BlockVariant.Paragraph),
          },
        ],
        [
          {
            text: 'Heading 1',
            logo: <FiType />,
            onClick: () => handleAddEmptyTextBlock(BlockVariant.Heading_1),
          },
          {
            text: 'Heading 2',
            logo: <FiType />,
            onClick: () => handleAddEmptyTextBlock(BlockVariant.Heading_2),
          },
          {
            text: 'Heading 3',
            logo: <FiType />,
            onClick: () => handleAddEmptyTextBlock(BlockVariant.Heading_3),
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
