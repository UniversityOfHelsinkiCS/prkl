import React from 'react';
import { Alert } from '@material-ui/lab';

export default ({ children, errors }) => {
  // Error means that input requirement was not fulfilled
  // only error that has its own message is TimeForm as all others use generic message
  const errorMsgs = Object.values(errors).reduce((allMsgs, error) => {
    return error.message ? allMsgs.concat(error.message) : allMsgs;
  }, []);
  return (
    <>
      {errorMsgs.map(message => (
        <Alert key={message} severity="error">
          {message}
        </Alert>
      ))}
      {Object.keys(errors).length !== 0 ? <Alert severity="error">{children}</Alert> : null}
    </>
  );
};
