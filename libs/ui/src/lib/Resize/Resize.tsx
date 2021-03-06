import classNames from 'classnames';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';

// For left hand side resizeable https://codesandbox.io/s/icy-architecture-1qtbz?file=/src/index.tsx

interface Props {
  defaultWindowWidth: number;
  minWindowWidth?: number;
  maxWindowWidth?: number;
  dragHandleWidth: number;
  children: JSX.Element;
  className?: string;
  dragHandleClassName?: string;
  onSetWidth?: (num: number) => void;
}

export const Resize: React.FunctionComponent<Props> = ({
  children,
  defaultWindowWidth,
  minWindowWidth,
  maxWindowWidth,
  dragHandleWidth,
  className,
  dragHandleClassName,
  onSetWidth,
}) => {
  const x = useMotionValue(defaultWindowWidth);
  const width = useTransform(
    x,
    (xSize) => `${xSize + 0.5 * dragHandleWidth}px`
  );

  return (
    <div className="relative flex h-full select-none flex-row">
      <motion.div
        className={classNames(className)}
        style={{ width }}
        transition={{ duration: 1 }}
        suppressHydrationWarning={true}
      >
        {children}
      </motion.div>
      <motion.div
        suppressHydrationWarning={true}
        className={classNames(
          'absolute   h-full cursor-move',
          dragHandleClassName
        )}
        style={{ width: dragHandleWidth, x }}
        drag="x"
        dragMomentum={false}
        onDragEnd={() => {
          if (onSetWidth) onSetWidth(x.get());
        }}
        dragConstraints={{
          left: minWindowWidth || undefined,
          right: maxWindowWidth || undefined,
        }}
      />
    </div>
  );
};
