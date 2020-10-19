import React, { useEffect } from 'react';
import { Card, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import CourseTag from './CourseTag';

export default ({ courses, user }) => {
  const intl = useIntl();

  return (
    <Card.Group itemsPerRow={1}>
      <div className="coursesList">
        {courses.map(course => (
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
            extra={<CourseTag course={course} user={user} />}
          />
        ))}
      </div>
    </Card.Group>
  );
};
