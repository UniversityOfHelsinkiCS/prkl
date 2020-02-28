import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Checkbox } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Question from '../courses/Question';

export default ({ courseId, questions }) => {
  const { register, handleSubmit, watch, errors } = useForm();
  const intl = useIntl();

  return (
    <Form onSubmit={handleSubmit}>
      {questions &&
        questions.map((question, index) => (
          <Question key={question.id} question={question} index={index} answers={questions} />
        ))}

      <Form.Field>
        <Checkbox
          name="toc"
          ref={register}
          label={intl.formatMessage({ id: 'course.dataCheckbox' })}
        />
      </Form.Field>

      <Form.Button primary type="submit" content={<FormattedMessage id="course.confirm" />} />
    </Form>
  );
};
