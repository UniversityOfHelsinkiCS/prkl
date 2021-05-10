import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useIntl } from 'react-intl';
import {
  AppBar,
  FormControl,
  InputLabel,
  Toolbar,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { ALL_COURSES } from '../../GqlQueries';
import { useLoaderStyle } from '../../styles/ui/Loader';
import { useCoursesStyles } from '../../styles/ui/Courses';
import CourseListStaffControls from './CourseListStaffControls';
import CourseList from './CourseList';
import { AppContext } from '../../App';

export default () => {
  const intl = useIntl();
  const classes = useCoursesStyles();
  const loaderClass = useLoaderStyle();
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState(localStorage.getItem('assembler.courseOrder') || 'name');
  const [showPastCourses, setShowPastCourses] = useState(
    localStorage.getItem('assembler.showPastCourses') === 'true'
  );
  const [showMyCourses, setShowMyCourses] = useState(
    localStorage.getItem('assembler.showMyCourses') === 'true'
  );
  const { user } = useContext(AppContext);

  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);

  if (courseLoading || courseError !== undefined) {
    return <CircularProgress className={loaderClass.root} />;
  }

  const { courses } = courseData;

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const changeOrder = event => {
    localStorage.setItem('assembler.courseOrder', event.target.value);
    setOrder(event.target.value);
  };

  const togglePastCourses = () => {
    setShowPastCourses(prev => {
      localStorage.setItem('assembler.showPastCourses', !prev);
      return !prev;
    });
  };

  const toggleMyCourses = () => {
    setShowMyCourses(prev => {
      localStorage.setItem('assembler.showMyCourses', !prev);
      return !prev;
    });
  };

  // Filter visible courses
  const visibleCourses = () => {
    if (!courses) {
      return [];
    }

    // Check here if course is published or not. Keep only published courses.
    const publishFilter = course => course.published === true;

    const deadlineFilter = course =>
      showPastCourses
        ? true
        : new Date(course.deadline) > new Date() ||
          (user.registrations ? user.registrations.find(r => r.course.id === course.id) : false);

    // Check teacher of the course
    const teacherFilter = course =>
      showMyCourses ? course.teachers.find(t => t.id === user.id) : true;

    const searchFilter = course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());

    const sortByName = (a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
    const sortByCode = (a, b) => (a.code.toLowerCase() < b.code.toLowerCase() ? -1 : 1);
    const sortByDeadline = (a, b) => (new Date(a.deadline) < new Date(b.deadline) ? -1 : 1);

    // Filter with role check.
    let filteredCourses;
    if (user.role === 1) {
      filteredCourses = courses
        .filter(publishFilter)
        .filter(deadlineFilter)
        .filter(searchFilter)
        .filter(teacherFilter);
    } else {
      filteredCourses = courses
        .filter(deadlineFilter)
        .filter(searchFilter)
        .filter(teacherFilter);
    }

    switch (order) {
      case 'name':
        filteredCourses.sort(sortByName);
        break;
      case 'code':
        filteredCourses.sort(sortByCode);
        break;
      case 'deadline':
        filteredCourses.sort(sortByDeadline);
        break;
      default:
        break;
    }

    return filteredCourses;
  };

  const orderOptions = [
    { value: 'name', text: intl.formatMessage({ id: 'courses.orderByNameOption' }) },
    { value: 'code', text: intl.formatMessage({ id: 'courses.orderByCodeOption' }) },
    { value: 'deadline', text: intl.formatMessage({ id: 'courses.orderByDeadlineOption' }) },
  ];

  const staffControls = [
    {
      text: intl.formatMessage({ id: 'courses.showPastCoursesButtonLabel' }),
      onChange: togglePastCourses,
      checked: showPastCourses,
    },
    {
      text: intl.formatMessage({ id: 'courses.showMyCourses' }),
      onChange: toggleMyCourses,
      checked: showMyCourses,
    },
  ];

  return (
    <div>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <TextField
            placeholder={intl.formatMessage({ id: 'courses.searchPlaceholder' })}
            onChange={handleSearchChange}
            className={classes.searchbar}
            variant="outlined"
          />

          <FormControl className={classes.orderby}>
            <InputLabel id="orderBy">Order by</InputLabel>
            <Select
              onChange={changeOrder}
              name="value"
              labelId="orderBy"
              value={order}
              style={{ width: '13em' }}
            >
              {orderOptions.map(o => (
                <MenuItem value={o.value}>{o.text}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <CourseListStaffControls controls={staffControls} />
        </Toolbar>
      </AppBar>

      <br />
      <Divider />
      <br />

      <CourseList courses={visibleCourses()} user={user} />
    </div>
  );
};
