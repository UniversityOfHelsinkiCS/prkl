/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { makeStyles, Popover, Box, List, ListItem, Tooltip, IconButton } from '@material-ui/core';
import { useStore } from 'react-hookstore';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { SwapHoriz } from '@material-ui/icons/';
import { grey } from '@material-ui/core/colors';
import swapElements from './SwapElements';

const useClasses = makeStyles({
  switchIcon: {
    height: 40,
    width: 40,
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
});

export default ({ setGroupsUnsaved, student }) => {
  const classes = useClasses();
  const [groups, setGroups] = useStore('groupsStore');

  const handleSwitchingGroup = (stdnt, toTableIndex) => {
    let fromTableIndex;
    let fromRowIndex;
    // eslint-disable-next-line array-callback-return
    groups.map((g, groupIndex) => {
      // eslint-disable-next-line array-callback-return
      g.students.map((s, studentIndex) => {
        if (s.id === stdnt.id) {
          fromTableIndex = groupIndex;
          fromRowIndex = studentIndex;
        }
      });
    });
    const toRowIndex = groups[toTableIndex].students.length;
    swapElements(
      fromRowIndex,
      toRowIndex,
      fromTableIndex,
      toTableIndex,
      groups,
      setGroups,
      setGroupsUnsaved
    );
  };

  return (
    <PopupState variant="popover">
      {popupState => (
        <div data-cy="switch-div">
          <Tooltip title="Switch group">
            <IconButton
              data-cy="switch-group-button"
              variant="contained"
              color="primary"
              className={classes.switchIcon}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...bindTrigger(popupState)}
            >
              <SwapHoriz />
            </IconButton>
          </Tooltip>
          <Popover
            data-cy="switch-group-popup"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p={2}>
              <List data-cy="switch-group-select">
                {groups.map((g, index) => {
                  return (
                    <ListItem
                      button
                      onClick={() => handleSwitchingGroup(student, index)}
                    >
                      {g.groupName}
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};
