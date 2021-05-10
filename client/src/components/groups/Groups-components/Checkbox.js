import React from 'react';
import { useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import { Info } from '@material-ui/icons';
import { Checkbox, FormControlLabel, Tooltip, IconButton, makeStyles } from '@material-ui/core';

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
        <IconButton aria-label="delete">
          <Info />
        </IconButton>
      </Tooltip>
    </div>
  );
};
