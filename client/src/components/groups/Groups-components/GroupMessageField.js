/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Typography, TextField } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useClasses = makeStyles({
  groupMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  groupMessageField: {
    paddingLeft: 10,
    fontSize: 12,
    width: '99%',
    marginBottom: 10,
  },
});

export default ({ setGroupMessages, tableIndex, setUnsaved, groupMessages }) => {
  const classes = useClasses();
  const intl = useIntl();

  const handleGroupMessageChange = (e, index) => {
    const newGroupMsgs = [...groupMessages];
    newGroupMsgs[index] = e.target.value;
    setGroupMessages(newGroupMsgs);
    setUnsaved();
  };

  return (
    <div>
      <Typography className={classes.groupMessage}>
        <FormattedMessage id="groups.message" />
      </Typography>
      <TextField
        onChange={e => handleGroupMessageChange(e, tableIndex)}
        data-cy="group-message-input"
        placeholder={intl.formatMessage({ id: 'groups.messageInfo' })}
        variant="outlined"
        value={groupMessages[tableIndex]}
        className={classes.groupMessageField}
      />
    </div>
  );
};
