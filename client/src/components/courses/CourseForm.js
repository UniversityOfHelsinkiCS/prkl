import React, { useState, useEffect } from 'react';
import { Form, Icon, Popup, Message } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { CREATE_COURSE, UPDATE_COURSE } from '../../GqlQueries';

import ConfirmationButton from '../ui/ConfirmationButton';
import QuestionForm from '../questions/QuestionForm';
import TeacherList from './TeacherList';
import roles from '../../util/userRoles';

// Renders form for both course addition and course edition
const CourseForm = ({ course, user, onCancelEdit, editView }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [currentUser] = useStore('userStore');

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deadline, setDeadline] = useState('');

  const [publishToggle, setPublishToggle] = useState(false);
  const [calendarToggle, setCalendarToggle] = useState(false);

  const history = useHistory();
  const intl = useIntl();

  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [createCourse] = useMutation(CREATE_COURSE);

  const { id, firstname, lastname, studentNo, email, role } = currentUser;
  const userFields = { id, firstname, lastname, studentNo, email, role };
  const currentTeachers = editView ? course.teachers : [userFields];
  const [courseTeachers, setCourseTeachers] = useState(currentTeachers);

  const [calendarId, setCalendarId] = useState('');
  const [calendarDescription, setCalendarDescription] = useState(
    `${intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })}`
  );

  let promptText;
  if (editView) {
    promptText = intl.formatMessage({
      id: publishToggle ? 'editView.confirmPublishSubmit' : 'editView.confirmSubmit',
    });
  } else {
    promptText = intl.formatMessage({
      id: publishToggle ? 'courseForm.confirmPublishSubmit' : 'courseForm.confirmSubmit',
    });
  }

  const getFormattedDate = setYesterday => {
    const date = new Date();
    if (setYesterday) date.setDate(date.getDate() - 1);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayParsed = `${yyyy}-${mm}-${dd}`;

  const calendarQuestion = {
    questionType: 'times',
    content: 'times',
    optional: false,
    useInGroupCreation: true,
    order: questions.length + 1,
  };

  const hookForm = useForm();
  const { setValue, trigger, errors, register, unregister } = hookForm;

  useEffect(() => {
    if (calendarToggle) {
      register(
        { name: 'nameCalendarDesc' },
        {
          required: intl.formatMessage({ id: 'courseForm.calendarDescMissingValidationMsg' }),
          maxLength: {
            value: 250,
            message: intl.formatMessage({ id: 'courseForm.calendarDescTooLongValidationMsg' }),
          },
        }
      );
      setValue('nameCalendarDesc', calendarDescription);
    } else {
      unregister('nameCalendarDesc');
    }
  }, [calendarToggle]); // eslint-disable-line

  useEffect(() => {
    register(
      { name: 'nameTitle' },
      {
        required: intl.formatMessage({ id: 'courseForm.titleMissingValidationMsg' }),
        maxLength: {
          value: 150,
          message: intl.formatMessage({ id: 'courseForm.titleTooLongValidationMsg' }),
        },
      }
    );
    register(
      { name: 'nameCode' },
      {
        required: intl.formatMessage({ id: 'courseForm.courseCodeMissingValidationMsg' }),
        maxLength: {
          value: 20,
          message: intl.formatMessage({ id: 'courseForm.courseCodeTooLongValidationMsg' }),
        },
      }
    );
    register(
      { name: 'nameDeadline' },
      {
        required: intl.formatMessage({ id: 'courseForm.deadlineMissingValidationMsg' }),
        min: editView
          ? {
              value:
                user === undefined || user.role === roles.ADMIN_ROLE ? null : getFormattedDate(),
              message: intl.formatMessage({ id: 'courseForm.deadlinePassedValidationMsg' }),
            }
          : {
              value: todayParsed,
              message: intl.formatMessage({ id: 'courseForm.deadlinePassedValidationMsg' }),
            },
      }
    );
    register(
      { name: 'nameDescription' },
      {
        required: intl.formatMessage({ id: 'courseForm.descriptionMissingValidationMsg' }),
        maxLength: {
          value: 2500,
          message: intl.formatMessage({ id: 'courseForm.descriptionTooLongValidationMsg' }),
        },
      }
    );
  }, []); // eslint-disable-line

  useEffect(() => {
    if (editView) {
      setCourseTitle(course.title);
      setValue('nameTitle', course.title);
      setCourseDescription(course.description);
      setValue('nameDescription', course.description);
      setCourseCode(course.code);
      setValue('nameCode', course.code);
      const qstns = course.questions
        .filter(q => q.questionType !== 'times')
        .map(q => {
          return {
            id: q.id,
            order: q.order,
            content: q.content,
            questionType: q.questionType,
            optional: q.optional,
            useInGroupCreation: q.useInGroupCreation,
            questionChoices: q.questionChoices.map(qc => {
              return { id: qc.id, content: qc.content, order: qc.order };
            }),
          };
        });
      setQuestions(qstns);
      const dateString = course.deadline.substring(0, 10);
      setDeadline(dateString);
      setValue('nameDeadline', dateString);
      setPublishToggle(course.published);
      const calendar = course.questions.find(q => q.questionType === 'times');
      setCalendarToggle(calendar);
      if (calendar) {
        setCalendarDescription(calendar.content);
        setValue('nameCalendarDesc', calendar.content);
        setCalendarId(calendar.id);
      }
    }
  }, []); // eslint-disable-line

  const closeRegistration = e => {
    e.preventDefault();
    setDeadline(getFormattedDate(true));
  };

  const handleSubmit = async () => {
    // TODO: Add logic for checking whether there is actually anything to update
    if (editView && calendarToggle) {
      calendarQuestion.id = calendarId;
      calendarQuestion.content = calendarDescription;
      calendarQuestion.order = questions.length;
    }
    if (!editView && calendarToggle) {
      calendarQuestion.content = calendarDescription;
    }

    const teacherRemoveType = courseTeachers.map(t => {
      const newT = { ...t };
      // eslint-disable-next-line no-underscore-dangle
      delete newT.__typename;
      return newT;
    });

    const questionsWOKeys = questions.map(q => {
      const opts = q.questionChoices ? q.questionChoices.map(qc => _.omit(qc, 'oName')) : [];
      const newQ = _.omit(q, 'qKey');
      newQ.questionChoices = opts;
      return newQ;
    });

    const courseObject = {
      title: courseTitle,
      description: courseDescription,
      code: courseCode,
      minGroupSize: editView ? course.minGroupSize : 1,
      maxGroupSize: editView ? course.maxGroupSize : 1,
      deadline: new Date(deadline).setHours(23, 59),
      teachers: teacherRemoveType,
      questions: calendarToggle ? questionsWOKeys.concat(calendarQuestion) : questionsWOKeys,
      published: publishToggle,
    };
    const variables = { id: editView ? course.id : undefined, data: { ...courseObject } };
    try {
      if (editView) {
        const result = await updateCourse({
          variables,
        });
        setCourses(
          courses.map(c => {
            return c.id !== course.id ? c : result.data.updateCourse;
          })
        );
      } else {
        const result = await createCourse({
          variables,
        });
        setCourses(courses.concat(result.data.createCourse));
        course = result.data.createCourse;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error:', error);
    }
    history.push(`/course/${course.id}`);
  };

  const handleAddForm = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '', qKey: new Date().getTime().toString() }]);
  };

  return (
    <div style={{ marginTop: '15px' }}>
      {editView ? (
        <h4>
          <FormattedMessage id="editView.pageTitle" />
        </h4>
      ) : (
        <h1>
          <FormattedMessage id="courseForm.pageTitle" />
        </h1>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            name="nameTitle"
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
            name="nameCode"
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
            name="nameDeadline"
            type="date"
            min={editView && user.role === roles.ADMIN_ROLE ? null : getFormattedDate()}
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

          {editView && user.role === roles.ADMIN_ROLE && (
            <Form.Button
              onClick={closeRegistration}
              label={intl.formatMessage({ id: 'editView.closeRegistrationLabel' })}
              data-cy="course-deadline-control"
            >
              {intl.formatMessage({ id: 'editView.closeRegistrationBtn' })}
            </Form.Button>
          )}
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            name="nameDescription"
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
          disabled={editView && course.published}
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
          checked={!!calendarToggle}
          onClick={() => setCalendarToggle(!calendarToggle)}
        />

        <Form.Input
          name="nameCalendarDesc"
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

        {editView && course.published ? (
          <p style={{ color: '#b00' }}>
            {intl.formatMessage({ id: 'editView.coursePublishedNotification' })}
          </p>
        ) : (
          <Form.Group>
            <Form.Button
              type="button"
              onClick={handleAddForm}
              color="green"
              data-cy="add-question-button"
            >
              <FormattedMessage id="courseForm.addQuestion" />
            </Form.Button>

            <Popup trigger={<Icon name="info circle" size="large" color="blue" />} wide="very">
              <Popup.Content>
                <FormattedMessage id="courseForm.infoBox" />
              </Popup.Content>
            </Popup>
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
              hideAddRemoveButtons={editView ? course.published : false}
              hookForm={hookForm}
            />
          ))}
        </Form.Group>

        <h3>
          <FormattedMessage id="courseForm.teacherInfo" />
        </h3>

        <div>
          <TeacherList courseTeachers={courseTeachers} setCourseTeachers={setCourseTeachers} />
        </div>

        {courseTeachers.length === 0 ? (
          <Message icon info>
            <Icon name="info" />
            <Message.Content>
              <Message.Header>
                <FormattedMessage id="course.noTeachers" />
              </Message.Header>
            </Message.Content>
          </Message>
        ) : null}

        <Form.Checkbox
          label={intl.formatMessage({ id: 'courseForm.publishCourse' })}
          checked={publishToggle}
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
        ) : null}

        {currentUser.role === roles.ADMIN_ROLE &&
          new Date(deadline).getTime() <= new Date().getTime() && (
            <p style={{ color: '#b00' }}>
              {intl.formatMessage({ id: 'editView.pastDeadlineWarning' })}
            </p>
          )}

        <ConfirmationButton
          onConfirm={handleSubmit}
          modalMessage={promptText}
          buttonDataCy="create-course-submit"
          formControl={hookForm}
        >
          <FormattedMessage id="courseForm.confirmButton" />
        </ConfirmationButton>

        {editView ? (
          <ConfirmationButton
            onConfirm={onCancelEdit}
            modalMessage={intl.formatMessage({ id: 'editView.confirmCancelEdits' })}
            buttonDataCy="create-course-cancel"
            color="red"
          >
            <FormattedMessage id="editView.cancelEditsButton" />
          </ConfirmationButton>
        ) : null}
      </Form>
    </div>
  );
};

export default CourseForm;
