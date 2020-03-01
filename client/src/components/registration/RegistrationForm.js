import React from 'react';
import { Form } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Question from './Question';
import ConfirmableButton from '../forms/ConfirmableButton';
import ValidationError from '../forms/ValidationError';

export default ({ questions, formControl, onSubmit }) => (
  <Form>
    {questions &&
      questions.map(question => (
        <Question key={question.id} question={question} hookForm={formControl} />
      ))}

    <ValidationError errors={formControl.errors}>
      <FormattedMessage id="forms.errorAnswerAll" />
    </ValidationError>

    <ConfirmableButton
      formControl={formControl}
      onClick={onSubmit}
      prompt={<FormattedMessage id="forms.confirmRegistration" />}
    >
      <FormattedMessage id="forms.submitRegistration" />
    </ConfirmableButton>
  </Form>
);
