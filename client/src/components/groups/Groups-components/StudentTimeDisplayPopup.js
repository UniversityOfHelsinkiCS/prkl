import React from 'react';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

import { Box, Typography } from '@material-ui/core';
import HourDisplay from '../../misc/HourDisplay';
import { count } from '../../../util/functions';

export default ({ student, regByStudentId }) => {
  const popupTimesDisplay = s => (
    <HourDisplay
      groupId={s.id}
      header={`${s.firstname} ${s.lastname}`}
      students={1}
      times={count([regByStudentId[s.studentNo]])}
    />
  );

  return (
    <PopupState variant="popover">
      {popupState => (
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bindHover(popupState)}
        >
          <Typography>{`${student.firstname} ${student.lastname}`}</Typography>
          <HoverPopover
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
            <Box p={2}>{popupTimesDisplay(student)}</Box>
          </HoverPopover>
        </div>
      )}
    </PopupState>
  );
};
