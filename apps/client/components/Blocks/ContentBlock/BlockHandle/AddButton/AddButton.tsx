import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { HeadingType, PageChildrenFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';

interface Props {
  block: PageChildrenFragment;
}

export const AddButton: React.FunctionComponent<Props> = ({ block }) => {
  const { createHeadingBlock, createParagraphBlock } = useBlock();

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
            logo: null,
            onClick: () =>
              createParagraphBlock({
                parentId: block.parentId,
                properties: { text: { rawText: '' } },
              }),
          },
        ],
        [
          {
            text: 'Heading 1',
            logo: null,
            onClick: () =>
              createHeadingBlock({
                parentId: block.parentId,
                properties: { text: { rawText: '' }, variant: HeadingType.H1 },
              }),
          },
          {
            text: 'Heading 2',
            logo: null,
            onClick: () =>
              createHeadingBlock({
                parentId: block.parentId,
                properties: { text: { rawText: '' }, variant: HeadingType.H2 },
              }),
          },
          {
            text: 'Heading 3',
            logo: null,
            onClick: () =>
              createHeadingBlock({
                parentId: block.parentId,
                properties: { text: { rawText: '' }, variant: HeadingType.H3 },
              }),
          },
        ],
      ]}
    />
  );
};
