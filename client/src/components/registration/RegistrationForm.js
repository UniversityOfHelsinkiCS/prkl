import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Question from './Question';
import ConfirmableButton from '../forms/ConfirmableButton';
import ValidationError from '../forms/ValidationError';
import TimeForm from '../forms/TimeForm';
import { Controller } from 'react-hook-form';

export default ({ questions, formControl, onSubmit }) => {
  const { setValue, triggerValidation, errors, register, control } = formControl;
  const intl = useIntl();

  useEffect(() => {
    register({ name: 'toc' }, { required: true });
  });

  return (
    <Form>
      {questions &&
        questions.map(question => (
          <Question key={question.id} question={question} hookForm={formControl} />
        ))}

      {/* <Controller
        as={TimeForm}
        name="controlledTimeForm"
        onChange={([event]) => {
          console.log('registration form', event);
          return event;
        }}
        control={control}
      /> */}
      {/* <TimeForm /> */}

      <Form.Checkbox
        label={intl.formatMessage({ id: 'forms.toc' })}
        name="toc"
        onChange={(e, { name, value }) => {
          setValue(name, value);
          triggerValidation(name);
        }}
        error={!!errors.toc}
        value="accepted"
      />

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
};
