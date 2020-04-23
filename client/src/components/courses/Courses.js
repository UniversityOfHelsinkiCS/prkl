import React, { useState } from 'react';
import { Input, Divider, Menu } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import CourseListStaffControls from './CourseListStaffControls';
import CourseList from './CourseList';

export default () => {
  const intl = useIntl();
  const [courses] = useStore('coursesStore');
  const [search, setSearch] = useState('');
  const [showPastCourses, setShowPastCourses] = useState(false);

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const togglePastCourses = () => {
    setShowPastCourses(prev => !prev);
  };

  const visibleCourses = () => {
    if (!courses) {
      return [];
    }

    const deadlineFilter = course =>
      showPastCourses ? true : new Date(course.deadline) > new Date();

    const searchFilter = course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());

    return courses.filter(deadlineFilter).filter(searchFilter);
  };

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
          <CourseListStaffControls onChange={togglePastCourses} />
        </Menu.Item>
      </Menu>
      <Divider />
      <CourseList courses={visibleCourses()} />
    </div>
  );
};
