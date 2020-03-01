import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-apollo';
import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE } from '../../util/questionTypes';
import { REGISTER_TO_COURSE } from '../../GqlQueries';
import SuccessMessage from '../forms/SuccessMessage';
import RegistrationForm from './RegistrationForm';

export default ({ courseId, questions }) => {
  const hookForm = useForm({ mode: 'onChange' });
  const { handleSubmit } = hookForm;
  const [createRegistration] = useMutation(REGISTER_TO_COURSE);
  const [success, setSuccess] = useState(false);

  // Format form data for GraphQL and post to backend.
  const onSubmit = async data => {
    // Remove TOC button's value.
    delete data.toc; // eslint-disable-line no-param-reassign

    const answer = { courseId };

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
