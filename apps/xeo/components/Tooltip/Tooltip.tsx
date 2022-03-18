import { createPopper } from '@popperjs/core';
import React from 'react';

interface Props {
  tooltip?: React.ReactNode;
}

export const Tooltip: React.FunctionComponent<Props> = ({
  children,
  tooltip,
}) => {
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const btnRef = React.createRef();
  const tooltipRef = React.createRef();
  const openLeftTooltip = () => {
    // @ts-ignore
    createPopper(btnRef.current, tooltipRef.current, {
      placement: 'top',
    });
    setTooltipShow(true);
  };
  const closeLeftTooltip = () => {
    setTooltipShow(false);
  };
  return (
    <div>
      <div
        onMouseEnter={openLeftTooltip}
        onMouseLeave={closeLeftTooltip}
        // @ts-ignore
        ref={btnRef}
      >
        {children}
      </div>
      {/* @ts-ignore */}
      <div className={tooltipShow ? '' : 'hidden '} ref={tooltipRef}>
        <div className="bg-dark-700 shadow-2xl p-2 mb-2 rounded-lg">
          {tooltip}
        </div>
      </div>
    </div>
  );
};
