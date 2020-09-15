import React, { useState } from 'react';
import { Input, Divider, Menu, Select } from 'semantic-ui-react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import CourseListStaffControls from './CourseListStaffControls';
import CourseList from './CourseList';

export default () => {
  const intl = useIntl();
  const [user] = useStore('userStore');
  const [courses] = useStore('coursesStore');
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState(localStorage.getItem('assembler.courseOrder') || 'name');
  const [showPastCourses, setShowPastCourses] = useState(
    localStorage.getItem('assembler.showPastCourses') === 'true'
  );
  const [showMyCourses, setShowMyCourses] = useState(
    localStorage.getItem('assembler.showMyCourses') === 'true'
  );

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const changeOrder = (_, { value }) => {
    localStorage.setItem('assembler.courseOrder', value);
    setOrder(value);
  };

  const togglePastCourses = () => {
    setShowPastCourses(prev => {
      localStorage.setItem('assembler.showPastCourses', !prev);
      return !prev;
    });
  };

  // Implement filtering by published courser and user role.

  // Function for staff controls
  const toggleMyCourses = () => {
    setShowMyCourses(prev => {
      localStorage.setItem('assembler.showMyCourses', !prev);
      return !prev;
    });
  };

  const visibleCourses = () => {
    if (!courses) {
      return [];
    }

    // Check here if course is published or not. Keep only published courses.
    // const publishFilter = course =>
    //  course.published = true; ???

    const deadlineFilter = course =>
      showPastCourses ? true : new Date(course.deadline) > new Date();

    // check teacher of the course
    const teacherFilter = course =>
      showMyCourses ? course.teacher.id === user.id : true;

    const searchFilter = course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());

    const sortByName = (a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
    const sortByCode = (a, b) => (a.code.toLowerCase() < b.code.toLowerCase() ? -1 : 1);
    const sortByDeadline = (a, b) => (new Date(a.deadline) < new Date(b.deadline) ? -1 : 1);

    // Filter with role check.
    // const filteredCourses = () => {
    //  if (user.role === 1) {
    //    return courses.filter(publishFilter).filter(deadlineFilter).filter(searchFilter);
    // } else {
    //    return courses.filter(deadlineFilter).filter(searchFilter);
    //  }
    // };

    const filteredCourses = courses.filter(deadlineFilter).filter(searchFilter).filter(teacherFilter);

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
      checked: showPastCourses
    },
    { 
      text: intl.formatMessage({ id: 'courses.showMyCourses' }),
      onChange: toggleMyCourses,
      checked: showMyCourses
    },
  ];

  return (
    <div>
      <Menu secondary>
        <Menu.Item>
          <Input
            onChange={handleSearchChange}
            placeholder={intl.formatMessage({ id: 'courses.searchPlaceholder' })}
          />
        </Menu.Item>
        <Menu.Item>
          <div style={{ marginRight: '1rem' }}>
            <FormattedMessage id="courses.orderByLabel" />
          </div>
          <Select options={orderOptions} value={order} onChange={changeOrder} />
        </Menu.Item>
        <Menu.Item>
          <CourseListStaffControls controls={staffControls}/>
        </Menu.Item>
      </Menu>
      <Divider />
      <CourseList courses={visibleCourses()} />
    </div>
  );
};
