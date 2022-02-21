import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, useRef, useState } from 'react';
import { Button, ButtonProps, ButtonVariation } from '../Button/Button';

export interface ModalContentProps {
  clickPrimary: () => void;
  clickSecondary: () => void;
  closeModal: () => void;
}

interface Props {
  trigger: (setOpen: () => void) => React.ReactNode;
  content: (setClosed: () => void) => React.ReactNode;
  mainText?: string;
  secondaryText?: string;
}

interface ModalFooterProps {
  clickPrimary?: () => void;
  clickSecondary?: () => void;
  primaryText: string;
  primaryButtonProps: ButtonProps;
  primaryVariation?: ButtonVariation;
  secondaryText?: string;
  className?: string;
}

const ModalFooter: React.FunctionComponent<ModalFooterProps> = ({
  clickPrimary,
  clickSecondary,
  primaryText,
  primaryButtonProps,
  primaryVariation,
  secondaryText,
  className,
}) => {
  return (
    <div
      className={classNames(
        'bg-dark-50 dark:bg-dark-800 gap-3 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6',
        className
      )}
    >
      <Button
        variation={primaryVariation ?? ButtonVariation.Primary}
        onClick={clickPrimary}
        type="submit"
        {...primaryButtonProps}
      >
        {primaryText}
      </Button>
      {secondaryText ? (
        <Button variation={ButtonVariation.Dark} onClick={clickSecondary}>
          {secondaryText}
        </Button>
      ) : null}
    </div>
  );
};

const Modal: React.FunctionComponent<Props> = ({ trigger, content }) => {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  return (
    <>
      {trigger(() => setOpen(true))}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="prose dark:prose-invert fixed inset-0 z-10 max-w-none overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="bg-dark-500 dark:bg-dark-700 fixed inset-0 bg-opacity-80 transition-opacity dark:bg-opacity-80" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="dark:bg-dark-900 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle">
                {content(() => setOpen(false))}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export { Modal, ModalFooter };
