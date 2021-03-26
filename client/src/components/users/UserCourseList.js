import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { withStyles, makeStyles, createMuiTheme  } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useUserCourseListStyles } from '../../styles'

export default ({ courses }) => {
  const intl = useIntl();
  const classes = useUserCourseListStyles();
  console.log(classes)
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