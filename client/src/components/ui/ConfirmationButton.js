import React from 'react';

import { Button, Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons';
import { RedButton, GreenButton } from '../../styles/ui/Button';

const ConfirmationButton = ({
  onConfirm,
  modalMessage = 'Confirm action?',
  children,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  buttonDataCy,
  formControl,
  color,
  className,
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
    <>
      <Button
        data-cy={buttonDataCy}
        onClick={triggerClick}
        style={{ backgroundColor: color }}
        className={className}
      >
        {children}
      </Button>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>{modalMessage}</DialogTitle>

        <DialogActions>
          <GreenButton data-cy="confirmation-button-confirm" onClick={confirm}>
            <DoneIcon /> {confirmButtonText}
          </GreenButton>

          <RedButton onClick={cancel}>
            <CloseIcon /> {cancelButtonText}
          </RedButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationButton;
