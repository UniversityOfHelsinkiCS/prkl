import React, { useEffect, useState } from 'react';
import { Form, Header } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Question from '../questions/Question';
import ConfirmationButton from '../ui/ConfirmationButton';
import ValidationError from '../ui/ValidationError';

export default ({ questions, formControl, onSubmit }) => {
  const [checkboxValue, setCheckboxValue] = useState('accepted');
  const { setValue, trigger, errors, register } = formControl;
  const intl = useIntl();

  useEffect(() => {
    register({ name: 'toc' }, { required: true });
  });

  return (
    <Form style={{ marginTop: '2rem' }} warning>
      <Header as="h3">
        <FormattedMessage id="course.questionsPreface" />
      </Header>
      {questions.some(q => q.questionType !== 'times') && (
        <div>
          <FormattedMessage id="forms.requiredQuestions" />
          <span style={{ color: 'red' }}> *</span>
        </div>
      )}
      {questions &&
        questions.map(question => (
          <Question key={question.id} question={question} hookForm={formControl} />
        ))}

      <Form.Checkbox
        label={intl.formatMessage({ id: 'forms.toc' })}
        name="toc"
        onChange={(e, { name, value }) => {
          setCheckboxValue(checkboxValue === 'accepted' ? undefined : 'accepted');
          setValue(name, value);
          trigger(name);
        }}
        error={!!errors.toc}
        value={checkboxValue}
        data-cy="toc-checkbox"
      />

      <ValidationError errors={formControl.errors}>
        <FormattedMessage id="forms.errorAnswerAll" />
      </ValidationError>

      <ConfirmationButton
        onConfirm={onSubmit}
        modalMessage={intl.formatMessage({ id: 'forms.confirmRegistration' })}
        buttonDataCy="register-on-course-button"
        color="green"
        formControl={formControl}
      >
        <FormattedMessage id="forms.submitRegistration" />
      </ConfirmationButton>
    </Form>
  );
};
