import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Header, Button, Loader, Table, Icon } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import roles from '../../util/user_roles';
import { COURSE_BY_ID, DELETE_COURSE, COURSE_REGISTRATION } from '../../GqlQueries';
import Registration from '../registration/Registration';

export default ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [course, setCourse] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const history = useHistory();

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
    variables: { courseId: id },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: data.course.questions.sort((a, b) => a.order - b.order),
      });
    }

    if (!regLoading && regData !== undefined) {
      setRegistrations(
        regData.courseRegistrations.map(r => {
          r.questionAnswers.sort((a, b) => a.question.order - b.question.order);
          r.questionAnswers.forEach(qa => qa.answerChoices.sort((a, b) => a.order - b.order));

          return r;
        })
      );
    }
  }, [data, loading, regData, regLoading]);

  if (error !== undefined) {
    console.log('error:', error);
    return <div>Error loading course</div>;
  }

  if (loading || !course) {
    return <Loader active />;
  }

  const handleDeletion = async () => {
    const variables = { id };
    if (window.confirm('Delete course?')) {
      try {
        await deleteCourse({
          variables,
        });
        const trimmedCourses = [];

        courses.forEach(remainingCourse => {
          if (remainingCourse.id !== id) {
            trimmedCourses.push(remainingCourse);
          }
        });
        setCourses(trimmedCourses);
      } catch (deletionError) {
        console.log('error:', deletionError);
      }
      history.push('/courses');
    }
  };

  const userIsRegistered = () => {
    const found = user.registrations.find(r => r.course.id === course.id);

    if (found === undefined) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <h2>{`${course.code} -${course.title}`}</h2>
      {user && user.role === roles.ADMIN_ROLE ? (
        <Button onClick={handleDeletion} color="red">
          <FormattedMessage id="course.delete" />
        </Button>
      ) : null}
      {userIsRegistered() ? (
        <Header as="h2">
          <Icon name="thumbs up outline" />
          <Header.Content>
            <FormattedMessage id="course.userHasRegistered" />
          </Header.Content>
        </Header>
      ) : (
        <>
          <Header as="h4" color="red">
            <FormattedMessage id="course.deadline" />
            <FormattedDate value={course.deadline} />
          </Header>
          <div>{course.description}</div>
          <h3>
            <FormattedMessage id="course.questionsPreface" />
          </h3>
          <Registration courseId={course.id} questions={course.questions} />
        </>
      )}
      <div>
        {course.questions && registrations && user.role === 3 ? (
          <div>
            <h3>Students enrolled to the course:</h3>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>first name</Table.HeaderCell>
                  <Table.HeaderCell>first name</Table.HeaderCell>
                  <Table.HeaderCell>student no.</Table.HeaderCell>
                  {course.questions.map(question => (
                    <Table.HeaderCell key={question.id}>{question.content}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {registrations.map(reg => (
                  <Table.Row key={reg.id}>
                    <Table.Cell>{reg.student.firstname}</Table.Cell>
                    <Table.Cell>{reg.student.lastname}</Table.Cell>
                    <Table.Cell>{reg.student.studentNo}</Table.Cell>
                    {reg.questionAnswers.map(qa => (
                      <Table.Cell key={qa.id}>
                        {qa.content
                          ? `${qa.content} |`
                          : qa.answerChoices.map(answer => `${answer.content} | `)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : null}
      </div>
    </div>
  );
};
