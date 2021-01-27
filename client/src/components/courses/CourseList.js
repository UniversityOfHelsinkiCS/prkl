import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import CourseTag from './CourseTag';

export default ({ courses, user }) => {
  const intl = useIntl();
  if (!courses.length === 0) {
    console.log('courseList', courses[0])
    console.log('courses teachers', courses[0].teachers)
  }

  return (
    <Card.Group itemsPerRow={1}>
      <div className="coursesList">
        {courses.map(course => (
          <Card
            data-cy={course.code}
            key={course.id}
            raised
            fluid
            as={Link}
            to={`/course/${course.id}`}
            className={new Date(course.deadline) < new Date() ? 'course-past' : null}
          >
            <Card.Content>
              <Card.Header>{course.code} - {course.title}</Card.Header>
              <Card.Description>{intl.formatMessage({
                id: 'courses.deadline',
                })} {intl.formatDate(course.deadline)}
              </Card.Description>
              <Card.Content as={Link}>
                {course.teachers.map(t => <p key={t.id}> {t.firstname} {t.lastname} {t.email}  </p>)}
              </Card.Content>
              <Card.Content>
                <CourseTag course={course} user={user} />
              </Card.Content>
            </Card.Content>  
          </Card>
        ))}
      </div>
    </Card.Group>
  );
};

