/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { useIntl } from 'react-intl';
import { List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import questionSwitch, { count } from '../../../util/functions';
import HourDisplay from '../../misc/HourDisplay';

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
