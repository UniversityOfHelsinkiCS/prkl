import React from 'react';
import { Alert } from '@material-ui/lab';

export default ({ children, errors }) =>
  Object.keys(errors).length !== 0 ? <Alert severity="error">{children}</Alert> : null;
