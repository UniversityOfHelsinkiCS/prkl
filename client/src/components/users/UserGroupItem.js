import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import HourDisplay from '../misc/HourDisplay';
import { useUserGroupItemStyles } from '../../styles/users/UserGroupItem';
  
export default ({ group, groupTimes, course }) => {
  const [showTime, setShowTime] = useState(false);
  const classes = useUserGroupItemStyles();

  const handleShowTime = () => {
    setShowTime(!showTime);
  };

  return (
    <TableContainer key={group.id} component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead data-cy="user-group-view-group-name" className={classes.head}>
          <TableRow>
            <TableCell className={classes.head}> {course.title}: {group.groupName}</TableCell>
            <TableCell className={classes.head} />
            <TableCell className={classes.head} align="right">
              {groupTimes[group.id] ? (
                <Button variant="outlined" className={classes.button} onClick={handleShowTime}>
                  <FormattedMessage id="groups.showTimes" />
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableHead className={classes.subHeading}>
          <TableRow>
            <TableCell className={classes.subHeading}>First name</TableCell>
            <TableCell className={classes.subHeading} align="center">
              Last Name
            </TableCell>
            <TableCell className={classes.subHeading} align="center">
              Email
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {group.students.map(student => (
            <TableRow className={classes.row} key={student.id}>
              <TableCell component="tr" scope="row">
                {student.firstname}
              </TableCell>
              <TableCell align="center">{student.lastname}</TableCell>
              <TableCell align="center">{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showTime ? (
        <HourDisplay
          times={groupTimes[group.id]}
          students={group.students.length}
          groupId={group.id}
        />
      ) : null}
    </TableContainer>
  );
};
