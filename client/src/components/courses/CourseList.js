import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import CourseTag from './CourseTag';

export default ({ courses, user }) => {
  const intl = useIntl();

  const disableCardLink = event => {
    event.stopPropagation();
  };

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
              <Card.Header>
                <a onClick={disableCardLink} href={`https://courses.helsinki.fi/fi/${course.code}`}>{course.code}</a> - {course.title}
              </Card.Header>

              <Card.Description>{intl.formatMessage({
                id: 'courses.deadline',
                })} {intl.formatDate(course.deadline)}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Card.Description>
                <FormattedMessage id="courses.teachers" />
                {course.teachers.map(t =>
                  (<p key={t.id}>{t.firstname} {t.lastname} - ({t.email})</p>))}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
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
            </Card.Content>

            <Card.Content extra>
              <CourseTag course={course} user={user} />
            </Card.Content>

          </Card>
        ))}
      </div>
    </Card.Group>   
  );
};

