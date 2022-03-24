/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { useStore } from 'react-hookstore';
import { SwapHoriz } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Popover, Box, List, ListItem, Tooltip, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
        <div>
          <Tooltip title="Switch group">
            <IconButton
              data-cy="switch-group-button"
              variant="contained"
              color="primary"
              className={classes.switchIcon}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...bindTrigger(popupState)}
              size="large">
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
            <div data-cy="switch-group-list">
              <Box p={2}>
                <List>
                  {groups.map((g, index) => {
                    return (
                      <ListItem
                        key={`switch-group-listItem-${index.toString()}`}
                        data-cy="switch-group-listItem"
                        button
                        onClick={() => handleSwitchingGroup(student, index)}
                      >
                        {g.groupName}
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </div>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};
