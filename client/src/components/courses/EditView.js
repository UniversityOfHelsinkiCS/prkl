import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_COURSE } from '../../GqlQueries';
import { useStore } from 'react-hookstore'
import QuestionForm from '../courseCreation/QuestionForm';

const EditView = ({ course }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [published, setPublished] = useState(false)
  const [calendarToggle, setCalendarToggle] = useState(false);
  const history = useHistory();
  const intl = useIntl();
  const [updateCourse] = useMutation(UPDATE_COURSE)

  const [courses, setCourses] = useStore('coursesStore');
  //const [course, setCourse] = useState({});

  useEffect(() => {
    console.log('course is ', course);
    setCourseTitle(course.title)
    setCourseDescription(course.description)
    setCourseCode(course.code)
    setQuestions(course.questions)
    let dateParts = intl.formatDate(course.deadline,
      { year: 'numeric', month: '2-digit', day: '2-digit' })
      .split('/');
    let dateString = dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1];
    setDeadline(dateString)
    setPublished(course.published)
    let calendar = course.questions.find(q => q.questionType === 'times')
    setCalendarToggle(calendar)
    if (calendar) {
      setCalendarDescription(calendar.content)
    }
  }, []);

  const [calendarDescription, setCalendarDescription] = useState(
    `${intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })}`
  );

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
    // TODO: Add logic for checking whether there is actually anything to update
    if (calendarToggle) {
      calendarQuestion.content = calendarDescription;
    }
    const promptText = published ? 'Confirm all edits and publish course? Published courses can only be edited by admins!' : 'Confirm all edits?';
    if (window.confirm(promptText)) {
      const courseObject = {
        title: courseTitle,
        description: courseDescription,
        code: courseCode,
        minGroupSize: course.minGroupSize,
        maxGroupSize: course.maxGroupSize,
        deadline: new Date(deadline).setHours(23, 59),
        questions: questions,                          // TODO: needs to be updated too
        published: published
      };
      const variables = { id: course.id, data: { ...courseObject } };
      try {
        const result = await updateCourse({
          variables,
        });
        setCourses(courses.map(c => {
          return c.id !== course.id ? c : result.data.updateCourse
        }))
      } catch (error) {
        console.log('error:', error);
      }
      history.push('/courses');
    }
  };

  const handleAddForm = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '' }]);
  };
  const handleRemoveForm = () => {
    setQuestions(questions.slice(0, questions.length - 1));
  };

  return (
    <div style={{'marginTop': '15px'}}>
      <h4>
        <FormattedMessage id="modifyCourse.pageTitle" />
      </h4>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            required
            fluid
            label={intl.formatMessage({
              id: 'courseForm.titleForm',
            })}
            value={courseTitle}
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
            value={courseCode}
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
            value={deadline}
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
            value={courseDescription}
            onChange={event => setCourseDescription(event.target.value)}
            data-cy="course-description-input"
          />
        </Form.Field>

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
          checked={calendarToggle ? true : false}
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

          <Form.Button type="button" onClick={handleRemoveForm} color="red">
            <FormattedMessage id="courseForm.removeQuestion" />
          </Form.Button>
        </Form.Group>

        <Form.Group style={{ flexWrap: 'wrap' }}>
          {questions?.map((q, index) => (
            <QuestionForm
              key={`addQuestionField${q.id}`}
              setQuestions={setQuestions}
              questions={questions}
              questionId={index}
            />
          ))}
        </Form.Group>

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.publishCourse' })}
          checked={published}
          onClick={() => setPublished(!published)}
        />

        <Form.Button primary type="submit" data-cy="create-course-submit">
          <FormattedMessage id="courseForm.confirmButton" />
        </Form.Button>
      </Form>
    </div>
  );
};

export default EditView;
