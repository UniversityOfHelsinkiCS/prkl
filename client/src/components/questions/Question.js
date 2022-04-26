import React from 'react';
import { useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import { makeStyles, TextField, MenuItem, Select, Grid, FormControl } from '@material-ui/core';
import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';
import ValidatedInput from '../ui/ValidatedInput';
import TimeForm from '../misc/TimeForm';

const useStyles = makeStyles({
  selectField: {
    minWidth: 120,
  },
});

const Question = ({ question, minHours, weekends, workTimeEndsAt, formControl }) => {
  const intl = useIntl();
  const name = question.id;
  const classes = useStyles();

  const changeType = () => {
    switch (question.questionType) {
      case FREEFORM:
        return (
          <ValidatedInput
            name={name}
            type={TextField}
            classes={classes.selectField}
            placeholder={intl.formatMessage({ id: 'course.freeFormPlaceholder' })}
            optionality={question.optional}
            formControl={formControl}
            data-cy={`question-${question.order}`}
          />
        );
      case SINGLE_CHOICE:
        return (
          <ValidatedInput
            name={name}
            type={TextField}
            classes={classes.selectField}
            select
            defaultValue=""
            displayEmpty
            optionality={question.optional}
            formControl={formControl}
            data-cy={`question-${question.order}`}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {question.questionChoices.map(c => (
              <MenuItem
                key={c.id}
                value={c.id}
                data-cy={`question-${question.order}-option-${c.order}`}
              >
                {c.content}
              </MenuItem>
            ))}
          </ValidatedInput>
        );
      case MULTI_CHOICE:
        return (
          <ValidatedInput
            id="multiChoise"
            name={name}
            type={Select}
            classes={classes.selectField}
            select
            multiple
            defaultValue={[]}
            optionality={question.optional}
            formControl={formControl}
            data-cy={`question-${question.order}`}
          >
            {question.questionChoices.map(c => (
              <MenuItem
                key={c.id}
                value={c.id}
                data-cy={`question-${question.order}-option-${c.order}`}
              >
                {c.content}
              </MenuItem>
            ))}
          </ValidatedInput>
        );

      default:
        return null;
    }
  };

  if (question.questionType === TIMES) {
    return (
      <Controller
        as={TimeForm}
        name={question.id}
        weekends={weekends}
        minHours={minHours}
        workTimeEndsAt={workTimeEndsAt}
        onChange={([event]) => {
          return event;
        }}
        formControl={formControl}
        control={formControl.control}
        description={question.content}
      />
    );
  }

  return (
    <div style={{ paddingTop: 5, paddingBottom: 5 }} data-cy="coursepage-question">
      <Grid container justifyContent="space-between">
        <Grid item>
          <b>{question.content}</b>
          {!question.optional && <span style={{ color: 'red' }}> *</span>}
        </Grid>
        <Grid item>
          <FormControl>{changeType()}</FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default Question;
