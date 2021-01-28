import React from 'react';
import { Card } from 'semantic-ui-react';
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

              {/* move style to App.css later*/}
              <Card.Description 
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '50%'
                }}
              >
                {course.description}
              </Card.Description>

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

