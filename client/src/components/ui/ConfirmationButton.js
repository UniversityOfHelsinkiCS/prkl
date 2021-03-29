import React from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';

const ConfirmationButton = ({
  onConfirm,
  isDisabled,
  modalMessage = 'Confirm action?',
  children,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  color = 'blue',
  buttonDataCy,
  formControl,
}) => {
  const [open, setOpen] = React.useState(false);

  const formIsValidated = async () => {
    const { trigger, errors } = formControl;
    await trigger();
    return Object.keys(errors).length === 0;
  };

  const triggerClick = async e => {
    e.preventDefault();
    if (formControl && !(await formIsValidated())) {
      return;
    }
    setOpen(true);
  };

  const cancel = e => {
    e.preventDefault();
    setOpen(false);
  };

  const confirm = e => {
    e.preventDefault();
    setOpen(false);
    onConfirm();
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      // nOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <Button disabled={isDisabled} data-cy={buttonDataCy} color={color} onClick={triggerClick}>
          {children}
        </Button>
      }
    >
      <Modal.Header>
        <Icon name="exclamation circle" /> {modalMessage}
      </Modal.Header>
      <Modal.Actions>
        <Button basic color="red" onClick={cancel}>
          <Icon name="remove" /> {cancelButtonText}
        </Button>
        <Button data-cy="confirmation-button-confirm" color="green" onClick={confirm}>
          <Icon name="checkmark" /> {confirmButtonText}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmationButton;
