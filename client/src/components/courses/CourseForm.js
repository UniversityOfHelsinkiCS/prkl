import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Icon, Popup, Message, Input } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStore } from 'react-hookstore';
import { CREATE_COURSE } from '../../GqlQueries';
import QuestionForm from '../questions/QuestionForm';
import TeacherList from './TeacherList';
import ConfirmationButton from '../ui/ConfirmationButton';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

// TODO: Tämä ja CourseEdit pitäisi yhdistää, hyvin runsaasti copypastea
// TODO: Validointi aiheuttaa pientä mutta huomattavaa viivettä kirjoittaessa fieldeihin ym.
//       Pitäisi katsoa saisiko suorituskykyä vähän parannettua jotenkin, kuitenkin validointitoiminnallisuus säilyttäen
// TODO: Submit-buttonin disablointi kun validointi epäonnistunut (kunnes korjatut)
// TODO: Missing key prop -virhe kyssäriä lisättäessä, vaikka ei pitäisi tulla (?)
const CourseForm = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deadline, setDeadline] = useState();
  const [calendarToggle, setCalendarToggle] = useState(false);
  const [publishToggle, setPublishToggle] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [user] = useStore('userStore');
  //pick needed fields from current user.
  const { id, firstname, lastname, studentNo, email, role } = user;
  const currentUser = { id, firstname, lastname, studentNo, email, role };
  const [courseTeachers, setCourseTeachers] = useState([currentUser]);

  const [courses, setCourses] = useStore('coursesStore');

  const [createCourse] = useMutation(CREATE_COURSE);
  const intl = useIntl();
  const [calendarDescription, setCalendarDescription] = useState(
    `${intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })}`
  );

  const promptText = intl.formatMessage({
    id: publishToggle ? 'courseForm.confirmPublishSubmit' : 'courseForm.confirmSubmit',
  });

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

  const hookForm = useForm();
  const { setValue, trigger, errors, register, unregister } = hookForm;

  useEffect(() => {
    if (calendarToggle) {
      register({ name: 'nameCalendarDesc' }, { required: intl.formatMessage({ id: 'courseForm.calendarDescValidationFailMsg' }) });
      setValue('nameCalendarDesc', calendarDescription);
    } else {
      unregister('nameCalendarDesc');
    }
  }, [calendarToggle]);

  useEffect(() => {
    register({ name: 'nameTitle' }, { required: intl.formatMessage({id: 'courseForm.titleValidationFailMsg',}) });
    register({ name: 'nameCode' }, { required: intl.formatMessage({id: 'courseForm.courseCodeValidationFailMsg',}) });
    register({ name: 'nameDeadline' }, { required: intl.formatMessage({id: 'courseForm.deadlineValidationFailMsg',}), 
      min: { value: todayParsed, message: intl.formatMessage({id: 'courseForm.deadlinePassedValidationFailMsg',}) } });
    register({ name: 'nameDescription' }, { required: intl.formatMessage({id: 'courseForm.descriptionValidationFailMsg',}) });
  }, []);

  const handleSubmit = async () => {
    if (calendarToggle) {
      calendarQuestion.content = calendarDescription;
    }

    const teachersRemoveType = courseTeachers.map(t => {
      const newT = { ...t }
      delete newT.__typename;
      return newT;
    });

    const questionsWOKeys = questions.map(q => {
      const opts = q.questionChoices 
        ? q.questionChoices.map(qc => _.omit(qc, 'oName'))
        : [];
      const newQ = _.omit(q, 'qKey')
      newQ.questionChoices = opts;
      return newQ;
    }
    );

    const courseObject = {
      title: courseTitle,
      description: courseDescription,
      code: courseCode,
      minGroupSize: 1,
      maxGroupSize: 1,
      teachers: teachersRemoveType,
      deadline: new Date(deadline).setHours(23, 59),
      published: !!publishToggle,
      questions: calendarToggle ? questionsWOKeys.concat(calendarQuestion) : questionsWOKeys
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
  };

  const handleShowTeachers = () => {
    setShowTeachers(!showTeachers);
  };

  const handleAddForm = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '', qKey: new Date().getTime().toString() }]);
  };

  return (
    <div>
      <h1>
        <FormattedMessage id="courseForm.pageTitle" />
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            name='nameTitle'
            fluid
            label={intl.formatMessage({
              id: 'courseForm.titleForm',
            })}
            onChange={async (e, { name, value }) => {
              setCourseTitle(e.target.value);
              setValue(name, value);
              await trigger(name);
            }}
            error={errors.nameTitle?.message}
            data-cy="course-title-input"
          />
        </Form.Field>

        <Form.Group>
          <Form.Input
            name='nameCode'
            label={intl.formatMessage({
              id: 'courseForm.courseCodeForm',
            })}
            onChange={async (e, { name, value }) => {
              setCourseCode(e.target.value);
              setValue(name, value);
              await trigger(name);
            }}
            error={errors.nameCode?.message}
            data-cy="course-code-input"
          />

          <Form.Input
            name='nameDeadline'
            type="date"
            label={intl.formatMessage({
              id: 'courseForm.courseDeadlineForm',
            })}
            onChange={async (e, { name, value }) => {
              setDeadline(e.target.value);
              setValue(name, value);
              await trigger(name);
            }}
            error={errors.nameDeadline?.message}
            data-cy="course-deadline-input"
          />
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            name='nameDescription'
            label={intl.formatMessage({
              id: 'courseForm.courseDescriptionForm',
            })}
            onChange={async (e, { name, value }) => {
              setCourseDescription(e.target.value);
              setValue(name, value);
              await trigger(name);
            }}
            error={errors.nameDescription?.message}
            data-cy="course-description-input"
          />
        </Form.Field>

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
          onClick={() => setCalendarToggle(!calendarToggle)}
        />

        <Form.Input
          name='nameCalendarDesc'
          disabled={!calendarToggle}
          label={intl.formatMessage({ id: 'courseForm.timeFormLabel' })}
          value={calendarDescription}
          onChange={async (e, { name, value }) => {
            setCalendarDescription(e.target.value);
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.nameCalendarDesc?.message}
          data-cy="course-calendar-description-input"
        />

        <Form.Group>
          <Form.Button type="button" onClick={handleAddForm} color="green">
            <FormattedMessage id="courseForm.addQuestion" />
          </Form.Button>

          <Popup trigger={<Icon name="info circle" size="large" color="blue" />} wide="very">
            <Popup.Content>
              <FormattedMessage id="courseForm.infoBox" />
            </Popup.Content>
          </Popup>
        </Form.Group>

        <Form.Group style={{ flexWrap: 'wrap' }}>
          {questions.map((q, index) => (
            <QuestionForm
              key={q.qkey}
              qName={q.qKey}
              setQuestions={setQuestions}
              questions={questions}
              questionIndex={index}
              hookForm={hookForm}
            />
          ))}
        </Form.Group>

        <h3>
          <FormattedMessage id="courseForm.teacherInfo" />
        </h3>

        {!showTeachers ? (
          <Form.Button type="button" onClick={handleShowTeachers} color="blue" data-cy="show-teacher-list-button">
            <FormattedMessage id="course.showTeachers" />
          </Form.Button>
        ) : (
            <div>
              <Form.Button type="button" onClick={handleShowTeachers} color="blue">
                <FormattedMessage id="course.hideTeachers" />
              </Form.Button>
              <TeacherList courseTeachers={courseTeachers} setCourseTeachers={setCourseTeachers} />
            </div>
          )}

        {courseTeachers.length === 0 ? (
          <Message icon info>
            <Icon name="info" />
            <Message.Content>
              <Message.Header>
                <FormattedMessage id="course.noTeachers" />
              </Message.Header>
            </Message.Content>
          </Message>
        ) : (
            null
          )}

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.publishCourse' })}
          onClick={() => setPublishToggle(!publishToggle)}
          data-cy="publish-checkbox"
        />

        {publishToggle ? (
          <Message icon info>
            <Icon name="info" />
            <Message.Content>
              <Message.Header>
                <FormattedMessage id="courseForm.publishAlert" />
              </Message.Header>
            </Message.Content>
          </Message>
        ) : (
            null
          )}

        <ConfirmationButton
          onConfirm={handleSubmit}
          modalMessage={promptText}
          buttonDataCy="create-course-submit"
          formControl={hookForm}
        >
          <FormattedMessage id="courseForm.confirmButton" />
        </ConfirmationButton>
      </Form>
    </div>
  );
};

export default CourseForm;
