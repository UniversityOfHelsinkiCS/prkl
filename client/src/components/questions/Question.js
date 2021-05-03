import React from 'react';
import { useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import { Segment, Grid, Form } from 'semantic-ui-react';

import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';
import ValidatedInput from '../ui/ValidatedInput';
import TimeForm from '../misc/TimeForm';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem, Select } from '@material-ui/core';

const Question = ({ question, formControl }) => {
  const intl = useIntl();
  const name = question.id;

  const changeType = () => {
    switch (question.questionType) {
      case FREEFORM:
        return (
          <ValidatedInput
            name={name}
            type={TextField}
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
                <MenuItem key={c.id} value={c.id}>{c.content}</MenuItem> 
             ))}
          </ValidatedInput>
        );
      case MULTI_CHOICE:
        return (
          <ValidatedInput
            name={name}
            type={Select}
            select
            multiple
            defaultValue={[]}
            optionality={question.optional}
            formControl={formControl}
            data-cy={`question-${question.order}`}
          >
            {question.questionChoices.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.content}</MenuItem>
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
        onChange={([event]) => {
          return event;
        }}
        control={formControl.control}
        description={question.content}
      />
    );

    // return <TimeForm name={question.id} formControl={formControl} />;
  }

  return (
    <div style={{ paddingTop: 5, paddingBottom: 5 }}>
      <Segment key={question.content} raised data-cy="coursepage-question">
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column verticalAlign="middle">
              <b>{question.content}</b>
              {!question.optional && <span style={{ color: 'red' }}> *</span>}
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Form.Field>{changeType()}</Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default Question;
