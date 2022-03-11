import { Fragment, useState } from 'react';
import { Listbox as ListboxHead, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

export type BaseListboxOption = {
  value: unknown;
  label: string;
};

export type Props<T extends BaseListboxOption> = {
  options: T[];
  value: T | undefined;
  onChange: (value: T) => void;
};

export const Listbox = <T extends BaseListboxOption>({
  options,
  value,
  onChange,
}: Props<T>): React.ReactElement => {
  return (
    <ListboxHead value={value} onChange={onChange}>
      <div className="relative mt-1">
        <ListboxHead.Button className="w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-dark-900 dark:ring-dark-800  ring-dark-200 focus:ring-primary-300 dark:focus:ring-dark-600 rounded-lg shadow-md cursor-pointer   sm:text-sm text-black dark:text-white">
          <span className="block truncate">{value?.label}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              className="w-5 h-5 text-dark-400"
              aria-hidden="true"
            />
          </span>
        </ListboxHead.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxHead.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-dark-900 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 pl-0">
            {options.map((option, optionIdx) => (
              <ListboxHead.Option
                key={optionIdx}
                className={({ active }) =>
                  `select-none list-none relative py-2 pl-10 cursor-pointer ${
                    active
                      ? 'text-dark-700 dark:bg-dark-700 dark:text-white bg-dark-200'
                      : 'text-dark-900 dark:text-white'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxHead.Option>
            ))}
          </ListboxHead.Options>
        </Transition>
      </div>
    </ListboxHead>
  );
};
