import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Icon, Message } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useStore } from 'react-hookstore';
import { UPDATE_COURSE } from '../../GqlQueries';
import roles from '../../util/userRoles';
import QuestionForm from '../questions/QuestionForm';
import ConfirmationButton from '../ui/ConfirmationButton';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import TeacherList from './TeacherList';

// TODO: Tämä ja CourseForm pitäisi yhdistää, hyvin runsaasti copypastea
// TODO: Validointi aiheuttaa pientä mutta huomattavaa viivettä kirjoittaessa fieldeihin ym.
//       Pitäisi katsoa saisiko suorituskykyä vähän parannettua jotenkin, kuitenkin validointitoiminnallisuus säilyttäen
// TODO: Submit-buttonin disablointi kun validointi epäonnistunut (kunnes korjatut)
const EditView = ({ course, user, onCancelEdit }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [published, setPublished] = useState(false);
  const [calendarToggle, setCalendarToggle] = useState(false);
  const history = useHistory();
  const intl = useIntl();
  const [updateCourse] = useMutation(UPDATE_COURSE);

  const {id, firstname, lastname, studentNo, email, role} = user;
  const currentUser = {id, firstname, lastname, studentNo, email, role};
  const [courseTeachers, setCourseTeachers] = useState([]);
  const [showTeachers, setShowTeachers] = useState(false);

  const [courses, setCourses] = useStore('coursesStore');

  const [calendarId, setCalendarId] = useState('');
  const [calendarDescription, setCalendarDescription] = useState(
    `${intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })}`
  );
  const confirmPromptText = intl.formatMessage({
    id: published ? 'editView.confirmPublishSubmit' : 'editView.confirmSubmit'
  });

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
      min: { value: user.role === roles.ADMIN_ROLE ? null : getFormattedDate(), message: intl.formatMessage({id: 'courseForm.deadlinePassedValidationFailMsg',}) } });
    register({ name: 'nameDescription' }, { required: intl.formatMessage({id: 'courseForm.descriptionValidationFailMsg',}) });
  }, []);

  useEffect(() => {
    setCourseTitle(course.title);
    setValue('nameTitle', course.title);
    setCourseDescription(course.description);
    setValue('nameDescription', course.description);
    setCourseCode(course.code);
    setValue('nameCode', course.code);
    const qstns = course.questions.filter(q => q.questionType !== 'times').map(q => {
      return {
        id: q.id,
        order: q.order,
        content: q.content,
        questionType: q.questionType,
        questionChoices: q.questionChoices.map(qc => {
          return { id: qc.id, content: qc.content, order: qc.order };
        })
      };
    });
    setQuestions(qstns);
    const dateParts = intl
      .formatDate(course.deadline, { year: 'numeric', month: '2-digit', day: '2-digit' })
      .split('/');
    const dateString = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
    setDeadline(dateString);
    setValue('nameDeadline', dateString);
    setPublished(course.published);
    const teachersCurrently = course.teachers;
    setCourseTeachers(teachersCurrently);
    const calendar = course.questions.find(q => q.questionType === 'times');
    setCalendarToggle(calendar);
    if (calendar) {
      setCalendarDescription(calendar.content);
      setValue('nameCalendarDesc', calendar.content);
      setCalendarId(calendar.id);
    }
  }, []);

  const getFormattedDate = (setYesterday) => {
    const date = new Date();
    if (setYesterday) date.setDate(date.getDate() - 1);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  const closeRegistration = e => {
    e.preventDefault();
    setDeadline(getFormattedDate(true));
  }

  const calendarQuestion = {
    questionType: 'times',
    content: 'times',
    order: questions.length + 1,
  };

  const handleSubmit = async () => {
    // TODO: Add logic for checking whether there is actually anything to update
    if (calendarToggle) {
      calendarQuestion.id = calendarId ? calendarId : undefined;
      calendarQuestion.content = calendarDescription;
      calendarQuestion.order = questions.length;
    }

    const teacherRemoveType = courseTeachers.map(t => {
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
      minGroupSize: course.minGroupSize,
      maxGroupSize: course.maxGroupSize,
      deadline: new Date(deadline).setHours(23, 59),
      teachers: teacherRemoveType,
      questions: calendarToggle ? questionsWOKeys.concat(calendarQuestion) : questionsWOKeys,
      published,
    };
    const variables = { id: course.id, data: { ...courseObject } };
    try {
      const result = await updateCourse({
        variables,
      });
      setCourses(
        courses.map(c => {
          return c.id !== course.id ? c : result.data.updateCourse;
        })
      );
    } catch (error) {
      console.log('error:', error);
    }
    history.push('/courses');
  };

  const handleShowTeachers = () => {
    setShowTeachers(!showTeachers);
  }

  const handleAddForm = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '', qKey: new Date().getTime().toString() }]);
  };

  return (
    <div style={{ marginTop: '15px' }}>
      <h4>
        <FormattedMessage id="editView.pageTitle" />
      </h4>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            name='nameTitle'
            fluid
            label={intl.formatMessage({
              id: 'courseForm.titleForm',
            })}
            value={courseTitle}
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
            value={courseCode}
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
            min={user.role === roles.ADMIN_ROLE ? null : getFormattedDate()}
            label={intl.formatMessage({
              id: 'courseForm.courseDeadlineForm',
            })}
            value={deadline}
            onChange={async (e, { name, value }) => {
              setDeadline(e.target.value);
              setValue(name, value);
              await trigger(name);
            }}
            error={errors.nameDeadline?.message}
            data-cy="course-deadline-input"
          />

          {user.role === roles.ADMIN_ROLE &&
            <Form.Button 
              onClick={closeRegistration} 
              label={intl.formatMessage({id: 'editView.closeRegistrationLabel'})}
              data-cy="course-deadline-control"
            >
              {intl.formatMessage({id: 'editView.closeRegistrationBtn'})}
            </Form.Button>
          }
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            name='nameDescription'
            label={intl.formatMessage({
              id: 'courseForm.courseDescriptionForm',
            })}
            value={courseDescription}
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
          disabled={course.published}
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
          checked={!!calendarToggle}
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
        />

        {course.published ? (
          <p style={{ "color": "#b00" }}> {intl.formatMessage({ id: 'editView.coursePublishedNotification' })} </p>
        ) : (
            <Form.Group>
              <Form.Button type="button" onClick={handleAddForm} color="green" data-cy="add-question-button" >
                <FormattedMessage id="courseForm.addQuestion" />
              </Form.Button>
            </Form.Group>
          )}

        <Form.Group style={{ flexWrap: 'wrap' }}>
          {questions?.map((q, index) => (
            <QuestionForm
              key={q.qKey ? q.qKey : q.id}
              qName={q.qKey ? q.qKey : q.id}
              setQuestions={setQuestions}
              questions={questions}
              questionIndex={index}
              hideAddRemoveButtons={course.published}
              hookForm={hookForm}
            />
          ))}
        </Form.Group>

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
          checked={published}
          onClick={() => setPublished(!published)}
          data-cy="course-published-checkbox"
        />

        {published ? (
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

        {user.role === roles.ADMIN_ROLE &&
         new Date(deadline).getTime() <= new Date().getTime() &&
         <p style={{ "color": "#b00" }}> { intl.formatMessage({ id: 'editView.pastDeadlineWarning' }) } </p>
        }

        <ConfirmationButton 
          onConfirm={handleSubmit}
          modalMessage={confirmPromptText}
          buttonDataCy="create-course-submit"
          formControl={hookForm}
        >
          <FormattedMessage id="courseForm.confirmButton" />
        </ConfirmationButton>
        
        <ConfirmationButton 
          onConfirm={onCancelEdit}
          modalMessage={ intl.formatMessage({ id: 'editView.confirmCancelEdits' }) }
          buttonDataCy="create-course-cancel"
          color="red"
        >
          <FormattedMessage id="editView.cancelEditsButton" />
        </ConfirmationButton>
      </Form>
    </div>
  );
};

export default EditView;
