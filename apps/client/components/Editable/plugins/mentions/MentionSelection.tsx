import classNames from 'classnames';
import { FiPlus } from 'react-icons/fi';

interface MentionSelectionProps {
  position: {
    top: string;
    left: string;
  };
  options: string[];
  selectedIndex: number;
}

export const MentionSelection: React.FunctionComponent<
  MentionSelectionProps
> = ({ position, options, selectedIndex }) => {
  return (
    <div
      className="fixed z-50 bg-dark-800"
      data-cy="mentions-portal"
      style={{ top: position.top, left: position.left }}
    >
      {options.length > 0 ? (
        options.map((option, i) => (
          <div
            key={option}
            className={classNames('p-1', {
              'bg-dark-600': i === selectedIndex,
            })}
          >
            {option}
          </div>
        ))
      ) : (
        <div className="flex flex-row items-center">
          <FiPlus /> Add new page
        </div>
      )}
    </div>
  );
};
