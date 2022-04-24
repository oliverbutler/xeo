import { ButtonColour, Modal, ModalFooter } from '@xeo/ui';
import Button, { ButtonProps } from './Button';

interface Props extends Omit<ButtonProps, 'onClick'> {
  confirmTitle?: string;
  confirmBody?: string;
  primaryText?: string;
  secondaryText?: string;
  onClick: () => void;
}

export const ConfirmButton: React.FunctionComponent<Props> = ({
  children,
  confirmTitle = 'Confirm Action?',
  confirmBody = 'This action cannot be undone.',
  primaryText = "I'm Sure",
  secondaryText = 'Cancel',
  onClick,
  ...buttonProps
}) => {
  return (
    <Modal
      mainText="Delete"
      trigger={(setOpen) => (
        <Button
          onClick={setOpen}
          colour={ButtonColour.Danger}
          variation="tertiary"
          {...buttonProps}
        >
          {children}
        </Button>
      )}
      content={(setClosed) => (
        <>
          <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
            <h2>{confirmTitle}</h2>
            <p>{confirmBody}</p>
          </div>
          <ModalFooter
            primaryText={primaryText}
            primaryVariation={ButtonColour.Danger}
            clickPrimary={() => {
              onClick();
              setClosed();
            }}
            clickSecondary={setClosed}
            secondaryText={secondaryText}
          />
        </>
      )}
    />
  );
};
