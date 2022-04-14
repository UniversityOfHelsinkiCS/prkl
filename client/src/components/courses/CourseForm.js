/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import {
  TextField,
  Button,
  FormGroup,
  Slider,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';

import { Alert } from '@material-ui/lab';

import { CREATE_COURSE, UPDATE_COURSE, COURSE_BY_CODE, ALL_COURSES } from '../../GqlQueries';

import { useCourseFormStyles } from '../../styles/courses/CourseForm';
import ConfirmationButton from '../ui/ConfirmationButton';
import QuestionForm from '../questions/QuestionForm';
import { TIMES } from '../../util/questionTypes';
import roles from '../../util/userRoles';
import TeacherList from './TeacherList';
import Popup from '../ui/Popup';

import AppContext from '../../AppContext';

// Renders form for both adding and editing a course
const CourseForm = ({ course, onCancelEdit, editView }) => {
  const classes = useCourseFormStyles();

  const { user } = useContext(AppContext);
  const history = useHistory();
  const intl = useIntl();

  // TARVITAAN JOKU JOKA PÄIVITTÄÄ NÄÄ kaikki sivut ku vaihdetaan sivua päivitys toimii todella huonosti
  const [updateCourse] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: ALL_COURSES }],
  });
  const [createCourse] = useMutation(CREATE_COURSE, {
    refetchQueries: [{ query: ALL_COURSES }],
  });

  const { id, firstname, lastname, studentNo, email, role } = user;
  const userFields = { id, firstname, lastname, studentNo, email, role };
  const currentTeachers = editView ? course.teachers : [userFields];
  const [courseTeachers, setCourseTeachers] = useState(currentTeachers);

  const [questions, setQuestions] = useState([]);
  const [publishToggle, setPublishToggle] = useState(false);
  const [calendarToggle, setCalendarToggle] = useState(false);
  const [workTimeEndsAt, setWorkTimeEndsAt] = useState(18);
  const [minHours, setMinWorkingHours] = useState(10);
  const [weekends, setWeekends] = useState(false);
  const [calendar, setCalendar] = useState(null);

  const hookForm = useForm({ mode: 'onChange' });
  const { setValue, getValues, errors, handleSubmit, control, reset } = hookForm;

  let confirmPromptText;
  if (editView) {
    confirmPromptText = intl.formatMessage({
      id: publishToggle ? 'editView.confirmPublishSubmit' : 'editView.confirmSubmit',
    });
  } else {
    confirmPromptText = intl.formatMessage({
      id: publishToggle ? 'courseForm.confirmPublishSubmit' : 'courseForm.confirmSubmit',
    });
  }

  const removeTypename = object => {
    const newObject = { ...object };
    // eslint-disable-next-line no-underscore-dangle
    delete newObject.__typename;
    return newObject;
  };

  useEffect(() => {
    if (editView) {
      setPublishToggle(course.published);
      const calendarQuestion = course.questions.find(q => q.questionType === TIMES);
      if (calendarQuestion) {
        setMinWorkingHours(course.minHours || minHours);
        setWorkTimeEndsAt(course.workTimeEndsAt || workTimeEndsAt);
        setWeekends(course.weekends || weekends);
        setCalendarToggle(true);
        setValue('calendarDescription', calendarQuestion.content);
        setCalendar(calendarQuestion);
        reset(calendarQuestion);
      }
      const qstns = course.questions
        .filter(q => q.questionType !== TIMES)
        .map(q => {
          const newQ = removeTypename(q);
          newQ.questionChoices = q.questionChoices.map(qc => removeTypename(qc));
          return newQ;
        });
      setQuestions(qstns);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getFormattedDate = setYesterday => {
    const date = new Date();
    if (setYesterday) date.setDate(date.getDate() - 1);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const closeRegistration = e => {
    e.preventDefault();
    setValue('deadline', getFormattedDate(true));
  };

  const handleAddQuestion = e => {
    e.preventDefault();
    setQuestions([...questions, { content: '', qKey: new Date().getTime().toString() }]);
  };

  const onSubmit = async formData => {
    const calendarQuestion = {
      questionType: TIMES,
      content: formData.calendarDescription,
      optional: false,
      useInGroupCreation: true,
      order: questions.length + 1,
    };

    if (editView && calendar) {
      calendarQuestion.id = calendar.id;
      calendarQuestion.order = calendar.order;
    }

    const teachersWithoutType = courseTeachers.map(t => removeTypename(t));

    // update questions with form data
    const updatedQuestions = questions.map((q, index) => {
      const formQuestion = formData.questions[q.id || q.qKey];
      const existingChoices = q.questionChoices
        ? q.questionChoices.map(qc => {
            const formChoice = formQuestion.options[qc.id];
            delete formQuestion.options[qc.id];
            return {
              ...qc,
              content: formChoice,
            };
          })
        : [];

      const newChoices = formQuestion.options
        ? Object.keys(formQuestion.options).map((key, i) => {
            return {
              content: formQuestion.options[key],
              order: existingChoices.length + i,
            };
          })
        : [];

      const choices = existingChoices.concat(newChoices);

      return {
        ...q,
        content: formQuestion.content,
        optional: formQuestion.optional,
        useInGroupCreation: formQuestion.useInGroupCreation,
        questionType: formQuestion.type,
        questionChoices: choices,
        order: q.order || index,
      };
    });

    const questionsWOKeys = updatedQuestions.map(q => {
      const omitOName = editView ? ['oName'] : ['oName', 'id'];
      const omitQKey = editView ? ['qKey'] : ['qKey', 'id'];
      const opts = q.questionChoices ? q.questionChoices.map(qc => _.omit(qc, omitOName)) : [];
      const newQ = _.omit(q, omitQKey);
      newQ.questionChoices = opts;
      return newQ;
    });

    const courseObject = {
      title: formData.courseTitle,
      description: formData.courseDescription,
      code: formData.courseCode,
      minGroupSize: editView ? course.minGroupSize : 1,
      maxGroupSize: editView ? course.maxGroupSize : 1,
      workTimeEndsAt,
      minHours,
      weekends,
      deadline: new Date(formData.deadline).setHours(23, 59),
      teachers: teachersWithoutType,
      questions: calendarToggle ? questionsWOKeys.concat(calendarQuestion) : questionsWOKeys,
      published: publishToggle,
    };

    const variables = { id: editView ? course.id : undefined, data: { ...courseObject } };

    try {
      if (editView) {
        // TODO: Responsive UI based on following variable result. See Notification.js
        // eslint-disable-next-line no-unused-vars
        await updateCourse({
          variables,
        });
        history.push(`/course/${course.id}`);
      } else {
        await createCourse({
          variables,
        });
        history.push(`/`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };

  // TÄÄ HOITAA KURSSIKOODILLA HAKEMISEN

  const code = getValues('courseCode') || '';
  console.log(code);
  const [getByCode, { called, loading, data, refetch }] = useLazyQuery(COURSE_BY_CODE, {
    variables: { code },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (called && !loading && data.getCourseByCode.length > 0) {
      const result = data.getCourseByCode[0];
      refetch();
      setMinWorkingHours(result.minHours || minHours);
      setWorkTimeEndsAt(result.workTimeEndsAt || workTimeEndsAt);
      setWeekends(result.weekends || weekends);
      setValue('courseTitle', result.title);
      setValue('courseDescription', result.description);
      const calendarQuestion = result.questions.find(q => q.questionType === TIMES);
      if (calendarQuestion) {
        // tämä ei todellakaan ole paras ratkaisu, sillä jos kirjoittaa muun kurssin, jolla ei ole timetablea, niin arvo jää. ratkaistu rivillä 230.
        setCalendarToggle(true);
        setValue('calendarDescription', calendarQuestion.content);
      } else {
        setCalendarToggle(false);
      }
      const qstns = result.questions
        .filter(q => q.questionType !== TIMES)
        .map(q => {
          const newQ = removeTypename(q);
          newQ.questionChoices = q.questionChoices.map(qc => removeTypename(qc));
          return newQ;
        });
      setQuestions(qstns);
    }
  }, [called, data, loading, minHours, refetch, setValue, weekends, workTimeEndsAt]);

  // / TÄÄ HOITAA KURSSIKOODILLA HAKEMISEN

  return (
    <div className={classes.root}>
      {editView ? (
        <h4>
          <FormattedMessage id="editView.pageTitle" />
        </h4>
      ) : (
        <h1>
          <FormattedMessage id="courseForm.pageTitle" />
        </h1>
      )}
      <form>
        {/* Course title input */}
        <Controller
          name="courseTitle"
          control={control}
          defaultValue={course?.title || ''}
          rules={{
            required: intl.formatMessage({ id: 'courseForm.titleMissingValidationMsg' }),
            maxLength: {
              value: 150,
              message: intl.formatMessage({ id: 'courseForm.titleTooLongValidationMsg' }),
            },
          }}
          render={props => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              fullWidth
              variant="outlined"
              label={intl.formatMessage({
                id: 'courseForm.titleForm',
              })}
              error={errors.courseTitle !== undefined}
              helperText={errors.courseTitle?.message}
              data-cy="course-title-input"
              className={classes.textField}
            />
          )}
        />

        <FormGroup row>
          {/* Course code input */}
          <Controller
            name="courseCode"
            control={control}
            defaultValue={course?.code || ''}
            rules={{
              required: intl.formatMessage({ id: 'courseForm.courseCodeMissingValidationMsg' }),
              maxLength: {
                value: 20,
                message: intl.formatMessage({ id: 'courseForm.courseCodeTooLongValidationMsg' }),
              },
            }}
            render={props => (
              <>
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                  variant="outlined"
                  label={intl.formatMessage({
                    id: 'courseForm.courseCodeForm',
                  })}
                  error={errors.courseCode !== undefined}
                  helperText={errors.courseCode?.message}
                  data-cy="course-code-input"
                  className={classes.textField}
                />

                <Button
                  disabled={editView} // Ehdotus ettei tätä tulisi käyttää editissä.
                  title="Copy course by code"
                  onClick={() => getByCode()}
                  startIcon={<SearchIcon />}
                  size="small"
                  variant="outlined"
                  className={classes.searchButton}
                  data-cy="search-code-button"
                >
                  Copy by code
                </Button>
              </>
            )}
          />
          {/* Deadline input */}
          <Controller
            name="deadline"
            control={control}
            defaultValue={course?.deadline.substring(0, 10) || ''}
            rules={{
              required: intl.formatMessage({ id: 'courseForm.deadlineMissingValidationMsg' }),
              min: editView
                ? {
                    value:
                      user === undefined || user.role === roles.ADMIN_ROLE
                        ? null
                        : getFormattedDate(),
                    message: intl.formatMessage({ id: 'courseForm.deadlinePassedValidationMsg' }),
                  }
                : {
                    value: getFormattedDate(),
                    message: intl.formatMessage({ id: 'courseForm.deadlinePassedValidationMsg' }),
                  },
            }}
            render={props => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                variant="outlined"
                type="date"
                label={intl.formatMessage({
                  id: 'courseForm.courseDeadlineForm',
                })}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.deadline !== undefined}
                helperText={errors.deadline?.message}
                data-cy="course-deadline-input"
                className={classes.textField}
              />
            )}
          />
          {/* Close registration button */}
          {editView && user.role === roles.ADMIN_ROLE && (
            <Button
              variant="contained"
              onClick={closeRegistration}
              data-cy="course-deadline-control"
              className={classes.closeRegButton}
            >
              {intl.formatMessage({ id: 'editView.closeRegistrationBtn' })}
            </Button>
          )}
        </FormGroup>

        {/* Course description input */}
        <Controller
          name="courseDescription"
          control={control}
          defaultValue={course?.description || ''}
          rules={{
            required: intl.formatMessage({ id: 'courseForm.descriptionMissingValidationMsg' }),
            maxLength: {
              value: 2500,
              message: intl.formatMessage({ id: 'courseForm.descriptionTooLongValidationMsg' }),
            },
          }}
          render={props => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              fullWidth
              multiline
              maxRows={5}
              variant="outlined"
              label={intl.formatMessage({
                id: 'courseForm.courseDescriptionForm',
              })}
              error={errors.courseDescription !== undefined}
              helperText={errors.courseDescription?.message}
              data-cy="course-description-input"
              className={classes.textField}
            />
          )}
        />

        {/* Calendar checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              disabled={editView && course.published}
              checked={calendarToggle}
              onClick={() => setCalendarToggle(!calendarToggle)}
              data-cy="calendar-checkbox"
            />
          }
          label={intl.formatMessage({ id: 'courseForm.includeCalendar' })}
        />

        {calendarToggle && (
          <div>
            <Card variant="outlined">
              <CardActions>
                <FormControlLabel
                  data-cy="weekend-checkbox"
                  control={
                    <Checkbox
                      disabled={editView} // Tässä bugi timeformin kanssa siksi disabled editviewissä
                      color="primary"
                      checked={weekends}
                      onClick={() => {
                        setWeekends(!weekends);
                      }}
                    />
                  }
                  label={intl.formatMessage({ id: 'courseForm.includeCalendarWeekends' })}
                />
              </CardActions>

              <CardActions>
                <TextField
                  data-cy="min-hour-field"
                  label="Minimum working hours"
                  style={{ width: 200 }}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 40 } }}
                  value={minHours}
                  onChange={e => {
                    let value = parseInt(e.target.value, 10);
                    if (value > 40) value = 40;
                    if (value < 0) value = 0;
                    setMinWorkingHours(value);
                  }}
                  error={minHours > 40}
                  helperText={minHours > 40 ? 'Minimum hours too much!' : ' '}
                  variant="outlined"
                />
              </CardActions>

              <CardContent>
                <h4>
                  {`Select the selectable working hours in week. Current selection 8.00 – ${workTimeEndsAt}.00`}
                </h4>
              </CardContent>
              <CardActions className={classes.slider}>
                <Slider
                  data-cy="working-hour-slider"
                  marks={[...Array(22 - 7)].map((x, i) => {
                    return {
                      label: `${i + 8}.00`,
                      value: i + 8,
                    };
                  })}
                  value={workTimeEndsAt}
                  onChange={(event, newValue) => setWorkTimeEndsAt(newValue)}
                  getAriaValueText={value => `${value}.00`}
                  step={1}
                  disabled={editView} // Tässä bugi timeformin kanssa siksi disabled editviewissä
                  min={8}
                  max={22}
                />
              </CardActions>
            </Card>
          </div>
        )}

        {/* Calendar description input */}
        <Controller
          name="calendarDescription"
          control={control}
          defaultValue={
            calendar?.content || intl.formatMessage({ id: 'courseForm.timeQuestionDefault' })
          }
          rules={{
            required: intl.formatMessage({ id: 'courseForm.calendarDescMissingValidationMsg' }),
            maxLength: {
              value: 250,
              message: intl.formatMessage({ id: 'courseForm.calendarDescTooLongValidationMsg' }),
            },
          }}
          render={props => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              fullWidth
              variant="outlined"
              label={intl.formatMessage({ id: 'courseForm.timeFormLabel' })}
              error={errors.calendarDescription !== undefined}
              helperText={errors.calendarDescription?.message}
              disabled={!calendarToggle}
              className={classes.textField}
            />
          )}
        />

        {editView && course.published ? (
          <Alert severity="info" className={classes.alert}>
            {intl.formatMessage({ id: 'editView.coursePublishedNotification' })}
          </Alert>
        ) : (
          <FormGroup row>
            <Button
              variant="contained"
              onClick={handleAddQuestion}
              data-cy="add-question-button"
              className={classes.addButton}
            >
              <FormattedMessage id="courseForm.addQuestion" />
            </Button>
            <Popup content={intl.formatMessage({ id: 'courseForm.infoBox' })}>
              <InfoIcon className={classes.info} />
            </Popup>
          </FormGroup>
        )}

        <FormGroup row>
          {questions?.map((q, index) => {
            return (
              <QuestionForm
                key={q.qKey ? q.qKey : q.id}
                qName={q.qKey ? q.qKey : q.id}
                setQuestions={setQuestions}
                questions={questions}
                questionIndex={index}
                hideAddRemoveButtons={editView ? course.published : false}
                hookForm={hookForm}
              />
            );
          })}
        </FormGroup>

        <h3>
          <FormattedMessage id="courseForm.teacherInfo" />
        </h3>
        <div>
          <TeacherList courseTeachers={courseTeachers} setCourseTeachers={setCourseTeachers} />
        </div>

        {courseTeachers.length === 0 && (
          <Alert severity="info" className={classes.alert}>
            <FormattedMessage id="course.noTeachers" />
          </Alert>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={publishToggle}
              onClick={() => setPublishToggle(!publishToggle)}
              data-cy="publish-checkbox"
            />
          }
          label={intl.formatMessage({ id: 'courseForm.publishCourse' })}
        />
        {publishToggle && (
          <Alert severity="warning" className={classes.alert}>
            <FormattedMessage id="courseForm.publishAlert" />
          </Alert>
        )}

        {role === roles.ADMIN_ROLE &&
          new Date(new Date(getValues('deadline')).getTime()).setHours(0, 0, 0, 0) <
            new Date(new Date().getTime()).setHours(0, 0, 0, 0) && (
            <Alert severity="warning" className={classes.alert}>
              <FormattedMessage id="editView.pastDeadlineWarning" />
            </Alert>
          )}

        {role === roles.ADMIN_ROLE &&
          new Date(new Date(getValues('deadline')).getTime()).setHours(0, 0, 0, 0) ===
            new Date(Date.now()).setHours(0, 0, 0, 0) && (
            <Alert severity="warning" className={classes.alert}>
              <FormattedMessage id="editView.todayDeadlineWarning" />
            </Alert>
          )}

        <FormGroup row className={classes.buttonGroup}>
          <ConfirmationButton
            onConfirm={handleSubmit(onSubmit)}
            color={blue[500]}
            modalMessage={confirmPromptText}
            buttonDataCy="create-course-submit"
            formControl={hookForm}
          >
            <FormattedMessage id="courseForm.confirmButton" />
          </ConfirmationButton>
          &nbsp;
          {editView ? (
            <ConfirmationButton
              onConfirm={onCancelEdit}
              modalMessage={intl.formatMessage({ id: 'editView.confirmCancelEdits' })}
              buttonDataCy="create-course-cancel"
              color={red[500]}
            >
              <FormattedMessage id="editView.cancelEditsButton" />
            </ConfirmationButton>
          ) : null}
        </FormGroup>
      </form>
    </div>
  );
};

export default CourseForm;
