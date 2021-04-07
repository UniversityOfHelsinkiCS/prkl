import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';

import CourseTag from './CourseTag';
import Dropdown from '../ui/Dropdown';

import { useCourseListStyles } from '../../styles/courses/CourseList';

export default ({ courses, user }) => {
  const intl = useIntl();
  const classes = useCourseListStyles();

  return (
    <div>
      {courses.map(course => (
        <Card
          className={new Date(course.deadline) < new Date() ? classes.coursePast : classes.root}
          component={Paper}
        >
          <CardContent component={Link} to={`/course/${course.id}`}>
            <Typography className={classes.code} color="textSecondary" gutterBottom>
              <a
                onClick={e => {
                  e.stopPropagation();
                }}
                href={`https://courses.helsinki.fi/fi/${course.code}`}
              >
                {course.code}
              </a>
              &nbsp; - &nbsp;
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {course.title}
              </Typography>
            </Typography>
            <Typography
              onClick={e => {
                e.stopPropagation();
              }}
              className={classes.deadline}
              gutterBottom
            >
              {intl.formatMessage({ id: 'courses.deadline' })}
              &nbsp;
              {intl.formatDate(course.deadline)}
              <Dropdown options={course.teachers} placeHolder="Mail to Teacher" />
            </Typography>
            <Typography className={classes.description} color="textSecondary" gutterBottom>
              {course.description}
            </Typography>
            <CourseTag course={course} user={user} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
