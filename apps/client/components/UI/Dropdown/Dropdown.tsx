import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';
import { Clickable } from '../Clickable/Clickable';

interface Props {
  button: React.ReactNode;
  showDirection: 'left' | 'right';
  className?: string;
  items: {
    logo: React.ReactNode;
    text: string;
    onClick?: () => void;
  }[][];
}

export const Dropdown: React.FunctionComponent<Props> = ({
  button,
  items,
  className,
  showDirection,
}) => {
  return (
    <Menu as="div">
      <Menu.Button as="div">{button}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'w-44 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50',
            { 'absolute left-1': showDirection === 'left' },
            { 'absolute right-1': showDirection === 'right' },
            className
          )}
        >
          {items.map((itemGroup, groupIndex) => (
            <div key={`item-${groupIndex}`}>
              {itemGroup.map((item, index) => (
                <Menu.Item>
                  <Clickable key={`item-${groupIndex}-${index}`}>
                    <button
                      onClick={item.onClick}
                      className={`group flex items-center w-full px-1 py-0.5 text-sm text-gray-800`}
                    >
                      <span className="mr-2">{item.logo}</span> {item.text}
                    </button>
                  </Clickable>
                </Menu.Item>
              ))}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
