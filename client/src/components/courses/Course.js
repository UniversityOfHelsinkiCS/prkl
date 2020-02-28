import React, { useState, useEffect } from 'react';
import { flatten } from 'ramda';

import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  Header, Button, Form, Loader, Card, Table,
} from 'semantic-ui-react';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl';
import roles from '../../util/user_roles';
import {
  COURSE_BY_ID,
  DELETE_COURSE,
  REGISTER_TO_COURSE,
  COURSE_REGISTRATION,
  CURRENT_USER,
  ALL_COURSES
} from '../../GqlQueries';
import Question from './Question';

const Course = ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [course, setCourse] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [createRegistration] = useMutation(REGISTER_TO_COURSE, { refetchQueries: [{ query: CURRENT_USER }] });

  const [deleteCourse] = useMutation(DELETE_COURSE);

  const history = useHistory();

  const intl = useIntl();

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, error: regError, data: regData } = useQuery(COURSE_REGISTRATION, {
    variables: { courseId: id },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: data.course.questions.sort((a, b) => a.order - b.order)
      })
    }

    if (!regLoading && regData !== undefined) {

      // TODO: sort with backend instead of this hacky shit
      // FIXME: this is fucked
      setRegistrations(
        regData.courseRegistrations.map(r => {
          r.questionAnswers.sort((a, b) => a.question.order - b.question.order)
          r.questionAnswers.forEach(qa => qa.answerChoices.sort((a, b) => a.order - b.order))

          return r
        })
      )
    }
  }, [data, loading, regData, regLoading]);

  const handleFormSubmit = async () => {
    const answer = {};
    answer.courseId = course.id;
    answer.questionAnswers = course.questions.map((question) => {
      if (question.questionType === 'freeForm') {
        return {
          questionId: question.id,
          content: question.answer,
        };
      }
      return {
        questionId: question.id,
        answerChoices: flatten([question.answer]).map((x) => ({ id: x })),
      };
    });
    console.log('submitanswer:', answer);
    try {
      await createRegistration({
        variables: { data: answer }
      });
      history.push('/courses');
      window.alert("enrolment succesful!")

    } catch (error) {
      console.log('error:', error);
    }
  };

  if (error !== undefined) {
    console.log('error:', error);
    return <div>Error loading course</div>;
  }

  if (loading || !course) {
    return <Loader active />;
  }

  const handleDeletion = async () => {
    const variables = { id };

    try {
      await deleteCourse({
        variables,
      });
      const trimmedCourses = [];

      courses.forEach((course) => {
        if (course.id !== id) {
          trimmedCourses.push(course);
        }
      });
      setCourses(trimmedCourses);
    } catch (error) {
      console.log('error:', error);
    }
    history.push('/courses');
  };

  const submitButtonDisabled = () => {
    const found = user.registrations.find((r) => r.course.id === course.id);
    console.log('user:', user);
    console.log('found:', found);

    if (found === undefined && checkbox) {
      return false;
    }
    console.log('no registration 4 u');
    return true;
  };

  return (
    <div>
      <h2>
        {course.code}
        {' '}
        -
        {course.title}
      </h2>

      {user && user.role === roles.ADMIN_ROLE ? (
        <Button onClick={handleDeletion} color="red">
          <FormattedMessage id="course.delete" />
        </Button>
      ) : null}

      <Header as="h4" color="red">
        <FormattedMessage id="course.deadline" />
        <FormattedDate value={course.deadline} />
      </Header>
      <div>{course.description}</div>
      <h3>
        <FormattedMessage id="course.questionsPreface" />
      </h3>
      <Form onSubmit={handleFormSubmit}>
        {course.questions
          && course.questions.map((question, index) => (
            <Question
              key={question.id}
              question={question}
              index={index}
              answers={course.questions}
            />
          ))}

        <Form.Checkbox
          required
          label={{
            children: intl.formatMessage({ id: 'course.dataCheckbox' }),
          }}
          onClick={() => setCheckbox(!checkbox)}
        >
        </Form.Checkbox>

        <Form.Button primary type="submit" disabled={submitButtonDisabled()}>
          <FormattedMessage id="course.confirm" />
        </Form.Button>
      </Form>
      <div>
        {course.questions && registrations && user.role === 3
          ? (
            <div>
              <h3>Students enrolled to the course:</h3>

              <Table>

                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>first name</Table.HeaderCell>
                    <Table.HeaderCell>first name</Table.HeaderCell>
                    <Table.HeaderCell>student no.</Table.HeaderCell>
                    {course.questions.map((question) => <Table.HeaderCell key={question.id}>{question.content}</Table.HeaderCell>)}
                  </Table.Row>
                </Table.Header>


                <Table.Body>

                  {registrations.map((reg) => (
                    <Table.Row key={reg.id}>
                      <Table.Cell>
                        {reg.student.firstname}
                      </Table.Cell>
                      <Table.Cell>
                        {reg.student.lastname}
                      </Table.Cell>
                      <Table.Cell>
                        {reg.student.studentNo}
                      </Table.Cell>
                      {reg.questionAnswers.map((qa) => (
                        <Table.Cell key={qa.id}>

                          |
                          {' '}
                          {qa.content ? `${qa.content} |`
                            : qa.answerChoices.map((answer) => `${answer.content} | `)}
                        </Table.Cell>
                      ))}

                    </Table.Row>
                  ))}
                </Table.Body>

              </Table>
            </div>
          )
          : null}
      </div>
    </div>
  );
};
export default Course;
