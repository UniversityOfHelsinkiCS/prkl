/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { useIntl } from 'react-intl';
import { makeStyles, List, ListItem } from '@material-ui/core';

import HourDisplay from '../../misc/HourDisplay';
import questionSwitch, { count } from '../../../util/functions';

const useClasses = makeStyles({
  hourDisplayList: {
    display: 'flex',
    overflow: 'auto',
  },
});

export default ({ group, regByStudentId }) => {
  const classes = useClasses();
  const intl = useIntl();

  return (
    <div>
      <List className={classes.hourDisplayList}>
        <ListItem>
          <HourDisplay
            header={intl.formatMessage({ id: 'groups.combinedHourDisplay' })}
            groupId={group.id}
            students={group.students.length}
            times={count(group.students.map(student => regByStudentId[student.studentNo]))}
          />
        </ListItem>
        {group.students.map(student => {
          regByStudentId[student.studentNo].questionAnswers.map(qa => questionSwitch(qa));
          return (
            <ListItem>
              <HourDisplay
                groupId={student.id}
                header={`${student.firstname} ${student.lastname}`}
                students={1}
                times={count([regByStudentId[student.studentNo]])}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
