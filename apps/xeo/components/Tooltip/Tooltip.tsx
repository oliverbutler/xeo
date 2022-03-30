import { Hover } from '@xeo/ui/lib/Hover/Hover';
import React from 'react';

interface Props {
  tooltip?: React.ReactNode;
}

export const Tooltip: React.FunctionComponent<Props> = ({
  children,
  tooltip,
}) => {
  return (
    <Hover
      hoverContent={
        <div className="bg-dark-200 dark:bg-dark-700 shadow-2xl p-2 mb-2 rounded-lg">
          {tooltip}
        </div>
      }
    >
      {children}
    </Hover>
  );
};
