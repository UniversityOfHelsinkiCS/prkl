/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import {
  FormGroup,
  TextField,
  Box,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { SINGLE_CHOICE, MULTI_CHOICE, FREEFORM } from '../../util/questionTypes';
import { useQuestionFormStyles } from '../../styles/questions/QuestionForm';

const QuestionForm = ({
  qName,
  questionIndex,
  setQuestions,
  questions,
  hideAddRemoveButtons,
  hookForm,
}) => {
  const classes = useQuestionFormStyles();

  const intl = useIntl();

  const [options, setOptions] = useState([]);
  const [questionType, setQuestionType] = useState(SINGLE_CHOICE);
  const [optional, setOptional] = useState(false);

  const { errors, control, unregister, setValue, setError, clearErrors } = hookForm;

  const initialQuestion = questions[questionIndex];

  // set initial values
  useEffect(() => {
    const choices = initialQuestion.questionChoices
      ? initialQuestion.questionChoices.map(qc => {
          const oName =
            qc.id || qc.oName || `question-${qName}-o-${new Date().getTime().toString()}`;
          return {
            ...qc,
            oName,
          };
        })
      : [];

    setOptions(choices);
    setQuestionType(initialQuestion.questionType || SINGLE_CHOICE);
    setOptional(initialQuestion.optional || false);
  }, []); // eslint-disable-line

  // uncheck useInGroupCreation if necessary
  useEffect(() => {
    if (optional || questionType === FREEFORM) {
      setValue(`questions.${qName}.useInGroupCreation`, false);
    }
  }, [optional, questionType]); // eslint-disable-line

  const missingChoicesErr = `missingchoices-${qName}`;

  // set or clear missingChoicesError
  useEffect(() => {
    if (questionType !== FREEFORM && options.length === 0) {
      setError(missingChoicesErr, {
        message: intl.formatMessage({
          id: 'questionForm.questionChoicesMissing',
        }),
      });
    } else {
      clearErrors(missingChoicesErr);
    }
  }, [options, questionType]); // eslint-disable-line

  const removeQuestion = () => {
    unregister(qName);
    clearErrors(missingChoicesErr);
    const newQuestions = questions
      .filter((q, i) => {
        return i !== questionIndex;
      })
      .map((q, i) => {
        return i < questionIndex ? q : { ...q, order: q.order - 1 };
      });
    setQuestions(newQuestions);
  };

  const handleTypeChange = type => {
    setQuestionType(type);
    if (questionType === FREEFORM) {
      options.forEach(o => unregister(`questions.${qName}.options.${o.oName}`));
      setOptions([]);
    }
  };

  const handleAddOption = () => {
    const oName = `question-${qName}-o-${new Date().getTime().toString()}`;
    setOptions([...options, { oName, order: options.length + 1, content: '' }]);
  };

  const handleRemoveOption = () => {
    if (options.length === 0) return;
    const { oName } = options[options.length - 1];
    unregister(`questions.${qName}.options.${oName}`);
    const newOptions = options.slice(0, options.length - 1);
    setOptions(newOptions);
  };

  return (
    <Box className={classes.questionContainer}>
      {!hideAddRemoveButtons && (
        <IconButton
          onClick={removeQuestion}
          style={{ float: 'right' }}
          data-cy="question-remove-button"
        >
          <CloseIcon />
        </IconButton>
      )}
      {/* Question title input */}
      <Controller
        name={`questions.${qName}.content`}
        control={control}
        defaultValue={initialQuestion?.content || ''}
        rules={{
          required: intl.formatMessage({ id: 'questionForm.questionTitleMissing' }),
          maxLength: {
            value: 150,
            message: intl.formatMessage({ id: 'questionForm.questionTitleTooLong' }),
          },
        }}
        render={props => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            fullWidth
            variant="outlined"
            label={intl.formatMessage({
              id: 'questionForm.questionTitle',
            })}
            error={errors.questions && errors.questions[qName]?.content !== undefined}
            helperText={errors.questions && errors.questions[qName]?.content?.message}
            data-cy="question-title"
            className={classes.textField}
          />
        )}
      />

      {/* Question type selection */}
      <FormControl disabled={hideAddRemoveButtons} className={classes.questionType}>
        <FormLabel>
          <FormattedMessage id="questionForm.questionTypeLabel" />
        </FormLabel>
        <Controller
          control={control}
          defaultValue={initialQuestion?.questionType || SINGLE_CHOICE}
          name={`questions.${qName}.type`}
          render={props => (
            <RadioGroup
              row
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              onChange={e => {
                props.onChange(e);
                handleTypeChange(e.target.value);
              }}
            >
              <FormControlLabel
                value={SINGLE_CHOICE}
                control={<Radio />}
                label={intl.formatMessage({
                  id: 'questionForm.singleChoice',
                })}
                data-cy="question-type-single"
              />
              <FormControlLabel
                value={MULTI_CHOICE}
                control={<Radio />}
                label={intl.formatMessage({
                  id: 'questionForm.multipleSelect',
                })}
                data-cy="question-type-multi"
              />
              <FormControlLabel
                value={FREEFORM}
                control={<Radio />}
                label={intl.formatMessage({
                  id: 'questionForm.freeformQuestion',
                })}
                data-cy="question-type-freeform"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      {questionType !== FREEFORM && (
        <>
          {/* Add/remove option buttons */}
          {!hideAddRemoveButtons && (
            <FormGroup row>
              <Button
                variant="contained"
                onClick={handleAddOption}
                data-cy="add-question-choice-button"
                className={classes.addButton}
              >
                <FormattedMessage id="questionForm.addOption" />
              </Button>
              <Button
                variant="contained"
                onClick={handleRemoveOption}
                data-cy="remove-question-choice-button"
                className={classes.removeButton}
              >
                <FormattedMessage id="questionForm.removeOption" />
              </Button>
            </FormGroup>
          )}

          {errors[missingChoicesErr] && (
            <Alert severity="error">{errors[missingChoicesErr]?.message}</Alert>
          )}

          {/* Question choice input */}
          <FormGroup row className={classes.questionChoices}>
            {options.map((o, index) => (
              <Controller
                key={o.oName}
                control={control}
                defaultValue={o?.content || ''}
                name={`questions.${qName}.options.${o.oName}`}
                rules={{
                  required: intl.formatMessage({
                    id: 'questionForm.questionChoiceLabelMissing',
                  }),
                  maxLength: {
                    value: 150,
                    message: intl.formatMessage({
                      id: 'questionForm.questionChoiceLabelTooLong',
                    }),
                  },
                }}
                render={props => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                    variant="outlined"
                    label={intl.formatMessage(
                      {
                        id: 'questionForm.optionTitle',
                      },
                      {
                        number: index + 1,
                      }
                    )}
                    error={
                      errors.questions &&
                      errors.questions[qName]?.options &&
                      errors.questions[qName].options[o.oName] !== undefined
                    }
                    helperText={
                      errors.questions &&
                      errors.questions[qName]?.options &&
                      errors.questions[qName].options[o.oName]?.message
                    }
                    data-cy={`question-${questionIndex}-choice-${index}`}
                    className={classes.textField}
                  />
                )}
              />
            ))}
          </FormGroup>
        </>
      )}
      <FormGroup className={classes.checkboxGroup}>
        {/* Optionality checkbox */}
        <FormControlLabel
          control={
            <Controller
              name={`questions.${qName}.optional`}
              control={control}
              defaultValue={initialQuestion?.optional || false}
              render={props => (
                <Checkbox
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                  checked={props.value}
                  onChange={e => {
                    props.onChange(e.target.checked);
                    setOptional(!optional);
                  }}
                  data-cy="question-optionality-checkbox"
                />
              )}
            />
          }
          label={intl.formatMessage({ id: 'questionForm.optional' })}
        />
        {/* UseInGroupCreation checkbox */}
        <FormControlLabel
          control={
            <Controller
              name={`questions.${qName}.useInGroupCreation`}
              control={control}
              defaultValue={initialQuestion?.useInGroupCreation || false}
              render={props => (
                <Checkbox
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                  checked={props.value}
                  onChange={e => {
                    props.onChange(e.target.checked);
                  }}
                  disabled={optional || questionType === FREEFORM}
                />
              )}
            />
          }
          label={intl.formatMessage({ id: 'questionForm.useInGroupCreation' })}
          disabled={optional || questionType === FREEFORM}
        />
      </FormGroup>
    </Box>
  );
};

export default QuestionForm;
