import { Popover as PopoverComponent, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface Props {
  button: React.ReactNode;
  input?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  direction: 'left' | 'right';
  items?: {
    title: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    arrow?: boolean;
  }[];
}

export const Popover: React.FunctionComponent<Props> = ({
  button,
  input,
  items,
  direction = 'right',
}) => {
  return (
    <PopoverComponent className="relative">
      {({ open }) => (
        <>
          <PopoverComponent.Button as="div">{button}</PopoverComponent.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <PopoverComponent.Panel
              className={classNames(
                ' bg-white dark:bg-neutral-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1',
                { 'absolute left-1': direction === 'right' },
                { 'absolute right-1': direction === 'left' }
              )}
              focus={true}
            >
              {input && (
                <input
                  className={classNames(
                    'my-1 mx-2 px-2 py-1 bg-gray-100 dark:bg-neutral-900 dark:text-white text-sm rounded-md w-56',
                    input.className
                  )}
                  {...input}
                />
              )}
              {items &&
                items.map((item) => (
                  <a
                    className={classNames(
                      'cursor-pointer hover:bg-gray-100rounded-sm flex items-center w-full px-2 py-1 text-sm text-gray-800 hover:bg-gray-100'
                    )}
                  >
                    <span className="mr-2">{item.icon}</span> {item.title}
                  </a>
                ))}
            </PopoverComponent.Panel>
          </Transition>
        </>
      )}
    </PopoverComponent>
  );
};
