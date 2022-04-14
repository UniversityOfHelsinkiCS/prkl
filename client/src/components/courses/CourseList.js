import { useIntl } from 'react-intl';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Card,
  Select,
  makeStyles,
  MenuItem,
  Typography,
  CardContent,
  FormControl,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { useCourseListStyles } from '../../styles/courses/CourseList';
import CourseTag from './CourseTag';

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
      <FormControl className={classes.formControl} component={'span'}>
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
            <MenuItem key={t.id} data-cy={t.firstname} onClick={() => handleClick(t, course)} value={t.id}>
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
          key={course.id}
          className={new Date(course.deadline) < new Date() ? classes.coursePast : classes.root}
          component={Paper}
          data-cy={course.code}
        >
          <CardContent component={Link} to={`/course/${course.id}`}>
            <Typography className={classes.courseCode} color="textSecondary" component="span">
              <a
                onClick={e => {
                  e.stopPropagation();
                }}
                href={`https://courses.helsinki.fi/fi/${course.code}`}
              >
                {course.code}
              </a>
              &nbsp; - &nbsp;
             
              <Typography className={classes.title} color="textSecondary" display="inline">
                {course.title}
              </Typography>
              </Typography>
            <Typography
            component="span"
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