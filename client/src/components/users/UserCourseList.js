import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

export default ({ courses, user }) => {
  const intl = useIntl();

  return (
    <Card.Group itemsPerRow={1}>
      <div className="coursesList">
        {courses.map(course => (
          <Card
            data-cy={course.code}
            key={course.id}
            raised
            color="blue"
            as={Link}
            to={`/course/${course.id}`}
            header={`${course.code} - ${course.title}`}
          />
        ))}
      </div>
    </Card.Group>
  );
};