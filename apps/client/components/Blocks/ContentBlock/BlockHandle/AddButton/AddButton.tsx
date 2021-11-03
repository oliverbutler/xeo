import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Props {}

export const AddButton: React.FunctionComponent<Props> = (props) => {
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
          },
          {
            text: 'Heading 1',
            logo: null,
          },
          {
            text: 'Heading 2',
            logo: null,
          },
          {
            text: 'Heading 3',
            logo: null,
          },
        ],
      ]}
    />
  );
};
