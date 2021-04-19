import React from 'react';
import { Link } from 'react-router-dom';

import { useUserCourseListStyles } from '../../styles/users/UserCourseList'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

export default ({ courses }) => {
  const classes = useUserCourseListStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.head}>Course Name</TableCell>
            <TableCell className={classes.head} align="center">Course Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow className={classes.row} component={Link} to={`/course/${course.id}`} key={course.code}>
              <TableCell component="th" scope="row">
                {course.title}
              </TableCell>
              <TableCell align="center">{course.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};