import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-apollo';
import Question from './Question';
import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE } from '../../util/questionTypes';
import { REGISTER_TO_COURSE } from '../../GqlQueries';

export default ({ courseId, questions }) => {
  const hookForm = useForm({ mode: 'onChange' });
  const { handleSubmit } = hookForm;
  const [createRegistration] = useMutation(REGISTER_TO_COURSE);

  // Format form data for GraphQL and post to backend.
  const onSubmit = async data => {
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
      await createRegistration({ variables: { data: answer } });
      // TODO: Show success notification.
    } catch (err) {
      // TODO: Handle errors.
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {questions &&
        questions.map(question => (
          <Question key={question.id} question={question} hookForm={hookForm} />
        ))}

      <Button primary type="submit">
        <FormattedMessage id="course.confirm" />
      </Button>
    </Form>
  );
  // TODO: Add TOC checkbox.
};
