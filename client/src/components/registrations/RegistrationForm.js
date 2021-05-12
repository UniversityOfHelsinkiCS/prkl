import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormControl, FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Question from '../questions/Question';
import ValidationError from '../ui/ValidationError';
import ConfirmationButton from '../ui/ConfirmationButton';

export default ({ questions, formControl, onSubmit }) => {
  const [checkboxValue, setCheckboxValue] = useState('accepted');
  const { setValue, trigger, errors, register } = formControl;
  const intl = useIntl();
  const terms = 'toc';

  useEffect(() => {
    register({ name: 'toc' }, { required: true });
  });

  return (
    <FormControl>
      <Typography variant="h4">
        <FormattedMessage id="course.questionsPreface" />
      </Typography>
      {questions.some(q => q.questionType !== 'times') && (
        <div>
          <FormattedMessage id="registrationForm.requiredQuestions" />
          <span style={{ color: 'red' }}> *</span>
        </div>
      )}

      {questions &&
        questions.map(question => (
          <FormControl>
            <Question key={question.id} question={question} formControl={formControl} />
          </FormControl>
        ))}

      <FormControlLabel
        control={
          <Checkbox
            name={terms}
            onChange={(e, value) => {
              setCheckboxValue(checkboxValue === 'accepted' ? undefined : 'accepted');
              setValue(terms, value);
              trigger(terms);
            }}
            error={!!errors.toc}
            value={checkboxValue}
            data-cy="toc-checkbox"
          />
        }
        label={intl.formatMessage({ id: 'registrationForm.toc' })}
      />

      <ValidationError errors={formControl.errors}>
        <FormattedMessage id="registrationForm.errorAnswerAll" />
      </ValidationError>

      <ConfirmationButton
        onConfirm={onSubmit}
        color={green[500]}
        modalMessage={intl.formatMessage({ id: 'registrationForm.confirmRegistration' })}
        buttonDataCy="register-on-course-button"
        formControl={formControl}
      >
        <FormattedMessage id="registrationForm.submitRegistration" />
      </ConfirmationButton>
    </FormControl>
  );
};
