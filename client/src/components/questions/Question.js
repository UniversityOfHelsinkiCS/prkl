import React from 'react';
import { useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import { Segment, Grid, Form, MenuItem } from 'semantic-ui-react';

import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';
import ValidatedInput from '../ui/ValidatedInput';
import TimeForm from '../misc/TimeForm';
import { TextField, Select } from '@material-ui/core';

const Question = ({ question, formControl }) => {
  const intl = useIntl();
  const name = question.id;
  console.log(question.questionChoices)

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
            name={question.id}
            placeholder={intl.formatMessage({ id: 'course.multipleChoicePlaceholder' })}
            optionality={question.optional}
            formControl={formControl}
            type={Select}
            data-cy={`question-${question.order}`}
          >
            {question.questionChoices.map(c => (
                <MenuItem key={c.id} value={c.value}>{c.content}</MenuItem> 
              ))}
          </ValidatedInput>

          /*<ValidatedInput
            name={question.id}
            placeholder={intl.formatMessage({ id: 'course.multipleChoicePlaceholder' })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.id,
              text: choice.content,
            }))}
            optionality={question.optional}
            formControl={formControl}
            type={Form.Dropdown}
            selection
            data-cy={`question-${question.order}`}
          />*/
        );
      case MULTI_CHOICE:
        return (
          <ValidatedInput
            name={question.id}
            placeholder={intl.formatMessage({ id: 'course.multipleChoicePlaceholder' })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.id,
              text: choice.content,
            }))}
            optionality={question.optional}
            formControl={formControl}
            type={Form.Dropdown}
            selection
            multiple
            data-cy={`question-${question.order}`}
          />
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
