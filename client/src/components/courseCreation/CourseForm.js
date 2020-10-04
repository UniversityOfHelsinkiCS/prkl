import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Checkbox, Form, Table, Icon, Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStore} from 'react-hookstore';
import { CREATE_COURSE, USERS_BY_ROLE } from '../../GqlQueries';
import QuestionForm from './QuestionForm';

const CourseForm = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deadline, setDeadline] = useState();
  const [calendarToggle, setCalendarToggle] = useState(false);
  const [publishToggle, setPublishToggle] = useState(false);
  const [courseTeachers, setCourseTeachers] = useState([]);

  const [courses, setCourses] = useStore('coursesStore');
  const [teachers, setTeachers] = useStore('teacherStore');

  const [createCourse] = useMutation(CREATE_COURSE);
  const intl = useIntl();
  const [calendarDescription, setCalendarDescription] = useState(
    `${intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })}`
  );

  
  const history = useHistory();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayParsed = `${yyyy}-${mm}-${dd}`;

  const calendarQuestion = {
    questionType: 'times',
    content: 'times',
    order: questions.length + 1,
  };

  const handleSubmit = async () => {
    if (calendarToggle) {
      calendarQuestion.content = calendarDescription;
    }
    if (window.confirm('Confirm course creation?')) {
      const courseObject = {
        title: courseTitle,
        description: courseDescription,
        code: courseCode,
        minGroupSize: 1,
        maxGroupSize: 1,
        teacher: courseTeachers,
        deadline: new Date(deadline).setHours(23, 59),
        published: publishToggle ? true : false,
        questions: calendarToggle ? questions.concat(calendarQuestion) : questions,
      };
      const variables = { data: { ...courseObject } };
      try {
        const result = await createCourse({
          variables,
        });
        setCourses(courses.concat(result.data.createCourse));
      } catch (error) {
        console.log('error:', error);
      }
      history.push('/courses');
    }
  };

  const handleTeacherToggle = () => {

  }

  const handleAddForm = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '' }]);
  };

  return (
    <div>
      <h1>
        <FormattedMessage id="courseForm.pageTitle" />
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            required
            fluid
            label={intl.formatMessage({
              id: 'courseForm.titleForm',
            })}
            onChange={event => setCourseTitle(event.target.value)}
            data-cy="course-title-input"
          />
        </Form.Field>

        <Form.Group>
          <Form.Input
            required
            label={intl.formatMessage({
              id: 'courseForm.courseCodeForm',
            })}
            onChange={event => setCourseCode(event.target.value)}
            data-cy="course-code-input"
          />

          <Form.Input
            required
            type="date"
            min={todayParsed}
            label={intl.formatMessage({
              id: 'courseForm.courseDeadlineForm',
            })}
            onChange={event => {
              setDeadline(event.target.value);
            }}
            data-cy="course-deadline-input"
          />
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            required
            label={intl.formatMessage({
              id: 'courseForm.courseDescriptionForm',
            })}
            onChange={event => setCourseDescription(event.target.value)}
            data-cy="course-description-input"
          />
        </Form.Field>

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
          onClick={() => setCalendarToggle(!calendarToggle)}
        />

        <Form.Input
          disabled={!calendarToggle}
          label={intl.formatMessage({ id: 'courseForm.timeFormLabel' })}
          value={calendarDescription}
          onChange={event => setCalendarDescription(event.target.value)}
        />

        <Form.Group>
          <Form.Button type="button" onClick={handleAddForm} color="green">
            <FormattedMessage id="courseForm.addQuestion" />
          </Form.Button>

          <Popup
            trigger={
              <Icon name="info circle" size="large" color="blue" />
            } wide="very"
          >
            <Popup.Content>
              <FormattedMessage id="courseForm.infoBox" />
            </Popup.Content>
          </Popup>
        </Form.Group>

        <Form.Group style={{ flexWrap: 'wrap' }}>
          {questions.map((q, index) => (
            <QuestionForm
              key={`addQuestionField${q.id}`}
              setQuestions={setQuestions}
              questions={questions}
              questionIndex={index}
            />
          ))}
        </Form.Group>

        <Table size='small'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Firstname</Table.HeaderCell>
                <Table.HeaderCell>Lastname</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teachers.map(u => (
                <Table.Row key={u.id}>
                  <Table.Cell>{u.firstname}</Table.Cell>
                  <Table.Cell>{u.lastname}</Table.Cell>
                  <Checkbox 
                    slider
                    checked
                    onChange={}
                  />
                </Table.Row>
              ))}
            </Table.Body>
        </Table>    
        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.publishCourse' })}
          onClick={() => setPublishToggle(!publishToggle)}
        />

        <Form.Button primary type="submit" data-cy="create-course-submit">
          <FormattedMessage id="courseForm.confirmButton" />
        </Form.Button>
      </Form>
    </div>
  );
};

export default CourseForm;
