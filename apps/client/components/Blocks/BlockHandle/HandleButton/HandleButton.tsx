import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import {
  FiCopy,
  FiEdit,
  FiMoreHorizontal,
  FiRepeat,
  FiTrash,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { PageChildrenFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { moveFocusToPreviousBlock } from '../../DynamicBlock/helpers/block';

interface Props {
  block: PageChildrenFragment;
}

export const HandleButton: React.FunctionComponent<Props> = ({ block }) => {
  const { deleteBlock } = useBlock();

  const handleDeleteBlock = async () => {
    await deleteBlock(block.id);

    await moveFocusToPreviousBlock(block.id);
  };

  return (
    <Dropdown
      button={
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="my-auto select-none hover:bg-dark-100 rounded-md opacity-0 group-hover:opacity-100 p-0.5 cursor-pointer text-dark-400 stroke-current"
        >
          <FiMoreHorizontal />
        </motion.div>
      }
      showDirection="right"
      items={[
        [
          {
            text: 'Delete',
            logo: <FiTrash />,
            onClick: handleDeleteBlock,
          },
          { text: 'Duplicate', logo: <FiCopy /> },
          { text: 'Turn Into', logo: <FiRepeat /> },
        ],
        [{ text: 'Colour', logo: <FiEdit /> }],
      ]}
    />
  );
};
