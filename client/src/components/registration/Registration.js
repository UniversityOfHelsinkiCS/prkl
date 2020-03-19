import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-apollo';
import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';
import { REGISTER_TO_COURSE } from '../../GqlQueries';
import SuccessMessage from '../forms/SuccessMessage';
import RegistrationForm from './RegistrationForm';

export default ({ courseId, questions }) => {
  const hookForm = useForm({ mode: 'onChange' });
  const { handleSubmit } = hookForm;
  const [createRegistration] = useMutation(REGISTER_TO_COURSE);
  const [success, setSuccess] = useState(false);

  const parseDay = (day, dayIndex, key) => {
    let prev = null;
    const list = [];

    const entries = Object.entries(day);

    if (!entries[0][1]) {
      [, prev] = entries;
    }

    for (let i = 1; i < entries.length; i += 1) {
      if (prev && entries[i][1]) {
        list.push({
          questionId: key,
          tentative: false,
          startTime: new Date(1970, 0, dayIndex + 5, prev[0], 0),
          endTime: new Date(1970, 0, dayIndex + 5, entries[i][0], 0),
        });
        prev = null;
      } else if (!prev && !entries[i][1]) {
        prev = entries[i];
      }

      if (i === entries.length - 1 && prev) {
        list.push({
          questionId: key,
          tentative: false,
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

  // Format form data for GraphQL and post to backend.
  const onSubmit = async data => {
    // Remove TOC button's value.
    delete data.toc; // eslint-disable-line no-param-reassign
    const answer = { courseId };

    answer.workingTimes = [];

    answer.questionAnswers = Object.keys(data).map(key => {
      const res = { questionId: key };
      const type = questions.filter(q => q.id === key)[0].questionType;

      switch (type) {
        case FREEFORM:
          res.content = data[key];
          break;

        case SINGLE_CHOICE:
          res.answerChoices = [{ id: data[key] }];
          break;

        case MULTI_CHOICE:
          res.answerChoices = data[key].map(id => ({ id }));
          break;

        case TIMES:
<<<<<<< HEAD
          parseWeek(data[key], key).forEach(stamp => {
            answer.workingTimes.push(stamp);
          });
=======
          console.log('imes');
          console.log('mitä imetään?', data[key]);
          console.log('parsed', parseWeek(data[key]));

          res.workingTimes = parseWeek(data[key]);
>>>>>>> adding working times works from client
          break;
        default:
          throw new Error('Question type not supported!');
      }

      return res;
    });

    try {
      // TODO: Add spinner before next line and disable the submit button on click.

      await createRegistration({ variables: { data: answer } });
      setSuccess(true);
    } catch (err) {
      // TODO: Handle errors.
      console.log(err);
    }
  };

  return success ? (
    <SuccessMessage>
      <FormattedMessage id="forms.registrationSuccess" />
    </SuccessMessage>
  ) : (
    <RegistrationForm
      onSubmit={handleSubmit(onSubmit)}
      questions={questions}
      formControl={hookForm}
    />
  );
  // TODO: Add TOC checkbox.
};
