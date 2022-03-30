import React, { useEffect } from 'react';
import { createPopper, Placement } from '@popperjs/core';

interface Props {
  hoverContent: React.ReactNode;
  open?: boolean;
  placement?: Placement;
}

export const Hover: React.FunctionComponent<Props> = ({
  children,
  hoverContent,
  open,
  placement = 'top',
}) => {
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const btnRef = React.createRef();
  const tooltipRef = React.createRef();

  const openLeftTooltip = () => {
    // @ts-ignore
    createPopper(btnRef.current, tooltipRef.current, {
      placement,
    });
    setTooltipShow(true);
  };

  const closeLeftTooltip = () => {
    setTooltipShow(false);
  };

  useEffect(() => {
    if (open !== undefined) {
      if (open) {
        openLeftTooltip();
      } else {
        closeLeftTooltip();
      }
    }
  }, [open]);

  return (
    <div>
      <div
        onMouseEnter={open === undefined ? openLeftTooltip : undefined}
        onMouseLeave={open === undefined ? closeLeftTooltip : undefined}
        // @ts-ignore
        ref={btnRef}
      >
        {children}
      </div>
      {/* @ts-ignore */}
      <div className={tooltipShow ? '' : 'hidden '} ref={tooltipRef}>
        {hoverContent}
      </div>
    </div>
  );
};
