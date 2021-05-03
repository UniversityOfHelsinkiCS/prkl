import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import CourseTag from './CourseTag';
import { useCourseListStyles } from '../../styles/courses/CourseList';

const useDropDownStyles = makeStyles({
  formControl: {
    minWidth: 120,
  },
  select: {
    position: 'relative',
    top: -3,
  },
});

const Dropdown = ({ teachers, course, placeHolder }) => {
  const classes = useDropDownStyles();
  const [teacher, setTeacher] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = event => {
    setTeacher(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClick = t => {
    window.location.href = `mailto:${t.email}?subject=${course.title}`;
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          className={classes.select}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={teacher}
          displayEmpty
          disableUnderline
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>{placeHolder}</em>
          </MenuItem>
          {teachers.map(t => (
            <MenuItem data-cy={t.firstname} onClick={() => handleClick(t, course)} value={t.id}>
              {t.firstname}
              &nbsp;
              {t.lastname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ({ courses, user }) => {
  const intl = useIntl();
  const classes = useCourseListStyles();

  return (
    <div>
      {courses.map(course => (
        <Card
          className={new Date(course.deadline) < new Date() ? classes.coursePast : classes.root}
          component={Paper}
          data-cy={course.code}
        >
          <CardContent component={Link} to={`/course/${course.id}`}>
            <Typography className={classes.courseCode} color="textSecondary" gutterBottom>
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
              data-cy={`${course.code}-dropdown`}
              onClick={e => {
                e.stopPropagation();
              }}
              className={classes.deadline}
              gutterBottom
            >
              {intl.formatMessage({ id: 'courses.deadline' })}
              &nbsp;
              {intl.formatDate(course.deadline)}
              &nbsp; &nbsp;
              <EmailIcon />
              &nbsp;
              <Dropdown
                teachers={course.teachers}
                course={course}
                placeHolder={intl.formatMessage({ id: 'courses.mailToTeacher' })}
              />
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
