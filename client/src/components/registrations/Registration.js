import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useStore } from 'react-hookstore';
import { red } from '@material-ui/core/colors';
import { FREEFORM, MULTI_CHOICE, SINGLE_CHOICE, TIMES } from '../../util/questionTypes';
import { REGISTER_TO_COURSE } from '../../GqlQueries';
import ConfirmationButton from '../ui/ConfirmationButton';
import RegistrationForm from './RegistrationForm';
import timeChoices from '../../util/timeFormChoices';
import UserGroup from '../users/UserGroup';
import { AppContext } from '../../App';
import { CourseContext } from '../courses/Course';

import { BlueButton } from '../../styles/ui/Button'

import { red } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

export default ({ course, match }) => {
  const hookForm = useForm({ mode: 'onChange' });
  const { handleSubmit } = hookForm;
  const { user } = useContext(AppContext);

  const [createRegistration] = useMutation(REGISTER_TO_COURSE, {
    update(cache, { data: { createRegistration: reg } }) {
      cache.modify({
        id: cache.identify(user),
        fields: {
          registrations(existingRegistrationRefs) {
            const newRegistrationRef = cache.writeFragment({
              data: reg,
              fragment: gql`
                fragment NewRegistration on Registration {
                  id
                }
              `,
            });
            return existingRegistrationRefs.concat(newRegistrationRef);
          },
        },
      });
    },
  });

  const { deleteRegistration } = useContext(CourseContext);
  const [notification, setNotification] = useStore('notificationStore');
  const courseId = course.id;
  const studentId = user.id;

  const variables = { studentId, courseId };
  const intl = useIntl();
  const history = useHistory();

  const parseDay = (day, dayIndex, key) => {
    let prev = [1, timeChoices.no];
    const list = [];

    const entries = Object.entries(day);

    if (entries[0][1] !== timeChoices.no) {
      [prev] = entries;
    }

    for (let i = 1; i < entries.length; i += 1) {
      if (prev[1] !== timeChoices.no && entries[i][1] !== prev[1]) {
        list.push({
          questionId: key,
          tentative: prev[1] === timeChoices.maybe,
          startTime: new Date(1970, 0, dayIndex + 5, prev[0], 0),
          endTime: new Date(1970, 0, dayIndex + 5, entries[i][0], 0),
        });
        prev = entries[i];
      } else if (prev[1] === timeChoices.no && entries[i][1] !== timeChoices.no) {
        prev = entries[i];
      }

      if (i === entries.length - 1 && prev[1] !== timeChoices.no) {
        list.push({
          questionId: key,
          tentative: prev[1] === timeChoices.maybe,
          startTime: new Date(1970, 0, dayIndex + 5, prev[0], 0),
          endTime: new Date(1970, 0, dayIndex + 5, Number.parseInt(entries[i][0], 10) + 1, 0),
        });
      }
    }

    return list;
  };

  const parseWeek = (week, key) => {
    const timeList = [];
    Object.values(week).forEach((day, dayIndex) => {
      const parsedDay = parseDay(day, dayIndex, key);

      parsedDay.forEach(stamp => {
        timeList.push(stamp);
      });
    });
    return timeList;
  };

  const handleUserGroupView = () => {
    if (match.params.subpage !== 'usergroup') {
      history.push(`/course/${course.id}/usergroup`);
    } else {
      history.push(`/course/${course.id}`);
    }
  };

  // Format form data for GraphQL and post to backend.
  const onSubmit = async data => {
    // Remove TOC button's value.
    delete data.toc; // eslint-disable-line no-param-reassign
    const answer = { courseId };

    answer.workingTimes = [];

    answer.questionAnswers = Object.keys(data).map(key => {
      const res = { questionId: key };
      const type = course.questions.filter(q => q.id === key)[0].questionType;

      switch (type) {
        case FREEFORM:
          res.content = data[key];
          break;

        case SINGLE_CHOICE:
          if (data[key] === undefined) {
            res.answerChoices = [];
          } else {
            res.answerChoices = [{ id: data[key] }];
          }
          break;

        case MULTI_CHOICE:
          if (data[key] !== undefined) {
            res.answerChoices = data[key].map(id => ({ id }));
          } else {
            res.answerChoices = [];
          }
          break;

        case TIMES:
          parseWeek(data[key], key).forEach(stamp => {
            answer.workingTimes.push(stamp);
          });
          break;
        default:
          throw new Error('Question type not supported!');
      }

      return res;
    });

    try {
      // TODO: Add spinner before next line and disable the submit button on click.
      const response = await createRegistration({ variables: { data: answer } });

      // TODO: add timeout success alert
      setNotification({
        type: 'success',
        message: intl.formatMessage({ id: 'registration.registrationSuccess' }),
        visible: true,
      });
    } catch (err) {
      // TODO: Handle errors.
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const handleRegistrationDeletion = async () => {
    try {
      await deleteRegistration({
        variables,
      });

      setNotification({
        type: 'success',
        message: intl.formatMessage({ id: 'registration.registrationCanceled' }),
        visible: true,
      });
    } catch (deletionError) {
      // eslint-disable-next-line no-console
      console.log('Error while deleting registration:', deletionError);
    }
    history.push('/courses');
  };

  const userIsRegistered = () => {
    const found = user.registrations?.find(r => r.course.id === course.id);

    return found !== undefined;
  };

  return (
    <div>
      {match.params.subpage === undefined ? (
        <div>
          {userIsRegistered() ? (
            <div>
              <br />
              <Typography variant="h4">
                <ThumbUpIcon fontSize="large" />&nbsp;
                <FormattedMessage id="course.userHasRegistered" />   
              </Typography>
              {new Date(course.deadline) > new Date() ? (
                <ConfirmationButton
                  onConfirm={handleRegistrationDeletion}
                  color={red[500]}
                  modalMessage={intl.formatMessage({ id: 'courseRegistration.cancelConfirmation' })}
                  buttonDataCy="cancel-registration-button"
                >
                  <br />
                  <FormattedMessage id="courseRegistration.cancel" />
                </ConfirmationButton>
              ) : (
                  <Typography variant="h5">
                   <FormattedMessage id="course.contactTeacher" /> 
                  </Typography>
              )}
              <div>
                {course.groupsPublished ? (
                  <div>
                    <br />
                    <BlueButton
                      onClick={handleUserGroupView}
                      color="blue"
                      data-cy="show-user-groups-button"
                    >
                      <FormattedMessage id="course.showUserGroup" />
                    </BlueButton>
                  </div>
                ) : (
                  <div>
                    <br />
                    <BlueButton disabled data-cy="disabled-show-user-groups-button">
                      <FormattedMessage id="course.disabledShowUserGroup" />
                    </BlueButton>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {new Date(course.deadline) > new Date() ? (
                <RegistrationForm
                  onSubmit={handleSubmit(onSubmit)}
                  questions={course.questions}
                  formControl={hookForm}
                />
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div>
          <UserGroup user={user} course={course} />
          <br />
          <BlueButton onClick={handleUserGroupView} data-cy="back-to-info-button">
            <FormattedMessage id="course.switchInfoView" />
          </BlueButton>
        </div>
      )}
    </div>
  );
};
