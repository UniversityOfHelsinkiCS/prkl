import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Question from './Question';

export default ({ courseId, questions }) => {
  const hookForm = useForm({ mode: 'onChange' });
  const { handleSubmit } = hookForm;

  const onSubmit = (data, e) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {questions &&
        questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            index={index}
            answers={questions}
            hookForm={hookForm}
          />
        ))}

      <Button primary type="submit">
        <FormattedMessage id="course.confirm" />
      </Button>
    </Form>
  );
};
