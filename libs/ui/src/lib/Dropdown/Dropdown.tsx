import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';
import { Clickable } from '../Clickable/Clickable';

type DropdownItem = {
  text: string;
  logo?: React.ReactNode;
  onClick?: () => void;
};

interface Props {
  button: React.ReactNode;
  showDirection: 'left' | 'right';
  className?: string;
  items: DropdownItem[][];
}

export const Dropdown: React.FunctionComponent<Props> = ({
  button,
  items,
  className,
  showDirection,
}) => {
  return (
    <Menu as="div" className="relative">
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
            'w-44 bg-white dark:bg-dark-900 divide-y divide-dark-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50 ',
            { 'absolute left-1': showDirection === 'left' },
            { 'absolute right-1': showDirection === 'right' },
            className
          )}
        >
          {items.map((itemGroup, groupIndex) => (
            <div key={`item-${groupIndex}`}>
              {itemGroup.map((item, index) => (
                <Menu.Item
                  key={`item-${groupIndex}-${index}`}
                  onClick={item.onClick}
                >
                  {({ active }) => (
                    <Clickable
                      active={active}
                      className="flex items-center w-full px-2 py-1 text-sm"
                    >
                      <span className="mr-2">{item.logo}</span> {item.text}
                    </Clickable>
                  )}
                </Menu.Item>
              ))}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
