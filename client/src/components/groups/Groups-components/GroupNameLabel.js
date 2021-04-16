import React from 'react';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import { Container, Paper, Typography, makeStyles, Popover, TextField } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useClasses = makeStyles({
  container: {
    padding: 10,
    borderRadius: 5,
    minWidth: '100%',
    maxWidth: '100%',
    backgroundColor: grey[200],
  },
});

export default ({ groupNames, tableIndex, setUnsaved, setGroupNames }) => {
  const classes = useClasses();

  const handleGroupNameChange = (e, index) => {
    const newGroupNames = [...groupNames];
    newGroupNames[index] = e.target.value;
    setGroupNames(newGroupNames);
    setUnsaved();
  };

  return (
    <Container className={classes.container} component={Paper}>
      <PopupState variant="popover">
        {popupState => (
          <div>
            <Typography
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...bindTrigger(popupState)}
              data-cy="group-name-label"
            >
              {groupNames[tableIndex] || ''}
            </Typography>
            <Popover
              data-cy="group-name-popup"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <TextField
                data-cy="group-name-input"
                defaultValue={groupNames[tableIndex] || ''}
                onChange={e => handleGroupNameChange(e, tableIndex)}
              />
            </Popover>
          </div>
        )}
      </PopupState>
    </Container>
  );
};
