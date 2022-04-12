import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { useUserCourseListStyles } from '../../styles/users/UserCourseList';


export default ({ courses }) => {
  const classes = useUserCourseListStyles();
  const history = useHistory();

  const handleRowClick = (courseid) => {
  
    history.push(`/course/${courseid}`);
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.head}>Course Name</TableCell>
            <TableCell className={classes.head} align="center">
              Course Code
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(course => (
            <TableRow
              className={classes.row}
              onClick={()=> handleRowClick(course.id)}
              key={course.code}
            >
              <TableCell>
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
