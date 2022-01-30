import { forwardRef, Fragment } from 'react';
import { FieldError } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon, XCircleIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

export interface SelectProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  error?: FieldError | undefined;
  options: SelectOption[];
}

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export const Select: React.FunctionComponent<SelectProps> = ({
  label,
  error,
  value,
  onChange,
  options,
}) => {
  const currentOptionSelected = options.find((x) => x.value === value);

  return (
    <div className="w-72">
      <label className="block text-sm font-bold mt-2">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button
            className={classNames(
              'relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md sm:text-sm cursor-default focus:ring-4 ring-opacity-50',
              { 'ring-4 ring-red-500': !!error }
            )}
          >
            <span className="block truncate text-dark-900 h-5">
              {currentOptionSelected?.label}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <XCircleIcon
                className={classNames('w-5 h-5 text-dark-200', {
                  ' text-dark-400 hover:text-dark-700 cursor-pointer': value,
                })}
                aria-hidden="true"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(undefined);
                }}
              />
              <SelectorIcon
                className="w-5 h-5 text-dark-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm px-0">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ selected, active }) =>
                    classNames(
                      'cursor-default select-none relative py-2 px-3 pr-4 list-none text-dark-900',
                      { 'text-primary-900 bg-primary-50': selected },
                      { 'text-primary-900 bg-primary-100': active }
                    )
                  }
                  value={option.value}
                  disabled={option.disabled}
                >
                  {({ selected }) => (
                    <span
                      className={`${
                        selected ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
