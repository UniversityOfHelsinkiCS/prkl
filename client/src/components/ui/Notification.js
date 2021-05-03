import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { notificationVar } from '../..';

const Notification = () => {
  const {visible, type, message} = notificationVar();

  const handleClose = () => {
    notificationVar({
      visible: false,
      type,
      message
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={visible}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert severity={type} variant="filled" data-cy="notification">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
