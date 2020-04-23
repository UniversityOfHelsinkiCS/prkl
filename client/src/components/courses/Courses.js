import React, { useState } from 'react';
import { Input, Card, Divider, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import CourseListStaffControls from './CourseListStaffControls';

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

    return courses.filter(deadlineFilter);
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

      <Card.Group itemsPerRow={1}>
        <div className="coursesList">
          {visibleCourses()
            .filter(
              course =>
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.code.toLowerCase().includes(search.toLowerCase())
            )
            .map(course => (
              <Card
                key={course.id}
                raised
                fluid
                as={Link}
                to={`/course/${course.id}`}
                header={`${course.code} - ${course.title}`}
                description={`${intl.formatMessage({
                  id: 'courses.deadline',
                })} ${intl.formatDate(course.deadline)}`}
                className={new Date(course.deadline) < new Date() ? 'course-past' : null}
              />
            ))}
        </div>
      </Card.Group>
    </div>
  );
};
