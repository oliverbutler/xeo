import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import classNames from 'classnames';

import { AddButton } from './AddButton/AddButton';
import { HandleButton } from './HandleButton/HandleButton';
import { PageBlockFragment } from 'generated';

interface BlockProps {
  children?: JSX.Element;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  block: PageBlockFragment;
}

export const BlockHandle = ({
  children,
  dragHandleProps,
  block,
}: BlockProps) => {
  const [isHover, setHover] = useState(false);

  const variants = {
    hover: { opacity: 1 },
    noHover: { opacity: 0 },
  };

  // py-0.5 on outside and py-1 on the inside due to a bug with margin collapse https://github.com/atlassian/react-beautiful-dnd/issues/953
  return (
    <div
      className={classNames(
        'flex flex-row group text-center relative py-0.5',
        {}
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="flex flex-row select-none absolute -left-12 top-2"
        animate={isHover ? 'hover' : 'noHover'}
        transition={{ duration: 0.3 }}
        variants={variants}
      >
        <div className="flex flex-col">
          <AddButton block={block} />
        </div>
        <div className="flex flex-col" {...dragHandleProps} tabIndex={-1}>
          <HandleButton block={block} />
        </div>
      </motion.div>
      <div className="flex-grow py-0.5">{children}</div>
    </div>
  );
};
