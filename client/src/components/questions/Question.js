import React from 'react';
import { useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import { Segment, Grid, Form } from 'semantic-ui-react';

import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';
import ValidatedInput from '../ui/ValidatedInput';
import TimeForm from '../misc/TimeForm';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Select, MenuItem, Checkbox, ListItemText } from '@material-ui/core';

const useStyles = makeStyles(({
  selectField: {
    minWidth: 120,
  }
}));

const Question = ({ question, formControl }) => {
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
            type={Select}
            defaultValue=""
            className={classes.selectField}
            optionality={question.optional}
            formControl={formControl}
            data-cy={`question-${question.order}`}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {question.questionChoices.map(c => (
                <MenuItem value={c.id}>{c.content}</MenuItem> 
             ))}
          </ValidatedInput>
        );
      case MULTI_CHOICE:
        return (
          <ValidatedInput
            name={name}
            type={Select}
            multiple
            defaultValue={[]}
            className={classes.selectField}
            optionality={question.optional}
            formControl={formControl}
            renderValue={(question) => question.content.join(', ')}
            data-cy={`question-${question.order}`}
          >
            {question.questionChoices.map(c => (
                <MenuItem value={c.id}>
                  <ListItemText primary={c.content} />  
                </MenuItem> 
             ))}
          </ValidatedInput>
          
          /*<ValidatedInput
            name={name}
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
          />*/
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
