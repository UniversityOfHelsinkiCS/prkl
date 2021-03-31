import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useStore } from 'react-hookstore';

const Notification = () => {
  const [notification, setNotification] = useStore('notificationStore');

  const handleClose = () => {
    setNotification({
      ...notification,
      visible: false,
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={notification.visible}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert severity={notification.type} variant="filled">
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
