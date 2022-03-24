import React from 'react';
import { useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import { Info } from '@mui/icons-material';
import { Checkbox, FormControlLabel, Tooltip, IconButton } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useClasses = makeStyles({
  checkbox: {
    display: 'flex',
    paddingLeft: 10,
  },
});

export default ({ group }) => {
  const classes = useClasses();
  const intl = useIntl();
  const [lockedGroupsStore, setLockedGroupsStore] = useStore('lockedGroupsStore');

  const checkBoxChange = grp => {
    if (lockedGroupsStore.includes(grp)) {
      const filtered = lockedGroupsStore.filter(g => g.groupId !== grp.groupId);
      setLockedGroupsStore(filtered);
    } else {
      setLockedGroupsStore(lockedGroupsStore.concat(grp));
    }
  };

  return (
    <div className={classes.checkbox}>
      <FormControlLabel
        control={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Checkbox
            onChange={() => checkBoxChange(group)}
            color="primary"
            data-cy="lockGroupsCheckBox"
          />
        }
        label={intl.formatMessage({ id: 'groups.lockGroup' })}
      />
      <Tooltip title={intl.formatMessage({ id: 'groups.lockGroupInfo' })}>
        <IconButton aria-label="delete" size="large">
          <Info />
        </IconButton>
      </Tooltip>
    </div>
  );
};
