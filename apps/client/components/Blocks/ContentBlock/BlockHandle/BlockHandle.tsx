import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import classNames from 'classnames';

interface BlockProps {
  children?: JSX.Element;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const BlockHandle = ({ children, dragHandleProps }: BlockProps) => {
  const [isHover, setHover] = useState(false);

  const variants = {
    hover: { opacity: 1 },
    noHover: { opacity: 0 },
  };

  // py-0.5 on outside and py-1 on the inside due to a bug with margin collapse https://github.com/atlassian/react-beautiful-dnd/issues/953
  return (
    <div
      className={classNames('flex flex-row group text-center relative py-0.5')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="flex flex-row select-none absolute -left-14 bottom-1"
        animate={isHover ? 'hover' : 'noHover'}
        transition={{ duration: 0.3 }}
        variants={variants}
      >
        <div className="flex flex-col">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="my-auto select-none hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 p-0.5 cursor-pointer text-gray-400 stroke-current"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              strokeWidth="0.2"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>
        <div className="flex flex-col" {...dragHandleProps}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="my-auto mr-1 hover:bg-gray-100 select-none rounded-md opacity-0 group-hover:opacity-100 p-0.5 cursor-pointer text-gray-400 stroke-current"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              strokeWidth="0.2"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
      <div className="flex-grow py-0.5">{children}</div>
    </div>
  );
};
