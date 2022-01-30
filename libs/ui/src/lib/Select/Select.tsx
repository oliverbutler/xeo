import { FieldError } from 'react-hook-form';
import ReactSelect, {
  Props as ReactSelectProps,
  OptionProps,
} from 'react-select';

export type SelectOptionType = OptionProps;

export type SelectProps = {
  label: string;
  error?: FieldError | undefined;
} & ReactSelectProps;

export const Select = ({ label, error, ...selectProps }: SelectProps) => {
  return (
    <div>
      <label className="block text-sm font-bold mt-2">{label}</label>
      <ReactSelect {...selectProps} />
    </div>
  );

  // return (
  //   <div className="w-72">
  //     <label className="block text-sm font-bold mt-2">{label}</label>
  //     <Listbox value={value} onChange={onChange} disabled={disabled}>
  //       <div
  //         className={classNames('relative mt-1', {
  //           'opacity-60': disabled || loading,
  //         })}
  //       >
  //         <Listbox.Button
  //           className={classNames(
  //             'relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md sm:text-sm cursor-default focus:ring-4 ring-opacity-50',
  //             { 'ring-4 ring-red-500': !!error }
  //           )}
  //         >
  //           <span className="block truncate text-dark-900 h-5">
  //             {currentOptionSelected?.label}
  //           </span>
  //           <span className="absolute inset-y-0 right-0 flex items-center pr-2">
  //             {loading ? (
  //               <svg
  //                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-400"
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 fill="none"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <circle
  //                   className="opacity-25"
  //                   cx="12"
  //                   cy="12"
  //                   r="10"
  //                   stroke="currentColor"
  //                   stroke-width="4"
  //                 ></circle>
  //                 <path
  //                   className="opacity-75"
  //                   fill="currentColor"
  //                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //                 ></path>
  //               </svg>
  //             ) : (
  //               <XCircleIcon
  //                 className={classNames('w-5 h-5 text-dark-200', {
  //                   ' text-dark-400 hover:text-dark-700 cursor-pointer':
  //                     value && !disabled,
  //                 })}
  //                 aria-hidden="true"
  //                 onClick={(e) => {
  //                   e.preventDefault();
  //                   e.stopPropagation();
  //                   onChange(undefined);
  //                 }}
  //               />
  //             )}
  //             <SelectorIcon
  //               className="w-5 h-5 text-dark-400"
  //               aria-hidden="true"
  //             />
  //           </span>
  //         </Listbox.Button>
  //         <Transition
  //           as={Fragment}
  //           leave="transition ease-in duration-100"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <Listbox.Options className="z-50 absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm px-0">
  //             {options.map((option) => (
  //               <Listbox.Option
  //                 key={option.value}
  //                 className={({ selected, active }) =>
  //                   classNames(
  //                     'cursor-default select-none relative py-2 px-3 pr-4 list-none text-dark-900',
  //                     { 'text-primary-900 bg-primary-50': selected },
  //                     { 'text-primary-900 bg-primary-100': active }
  //                   )
  //                 }
  //                 value={option.value}
  //                 disabled={option.disabled}
  //               >
  //                 {({ selected }) => (
  //                   <span
  //                     className={`${
  //                       selected ? 'font-medium' : 'font-normal'
  //                     } block truncate`}
  //                   >
  //                     {option.label}
  //                   </span>
  //                 )}
  //               </Listbox.Option>
  //             ))}
  //           </Listbox.Options>
  //         </Transition>
  //       </div>
  //     </Listbox>
  //   </div>
  // );
};

export default Select;
