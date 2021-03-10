import React from 'react';
import { Segment, Grid, Form } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { Controller } from 'react-hook-form';
import TimeForm from '../misc/TimeForm';
import ValidatedInput from '../ui/ValidatedInput';
import { FREEFORM, SINGLE_CHOICE, MULTI_CHOICE, TIMES } from '../../util/questionTypes';

const Question = ({ question, hookForm }) => {
  const intl = useIntl();

  const changeType = () => {
    switch (question.questionType) {
      case FREEFORM:
        return (
          <ValidatedInput
            name={question.id}
            type={Form.Input}
            placeholder={intl.formatMessage({ id: 'course.freeFormPlaceholder' })}
            optionality={question.optional}
            formControl={hookForm}
            data-cy={`question-${question.order}`}
          />
        );
      case SINGLE_CHOICE:
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
            formControl={hookForm}
            type={Form.Dropdown}
            selection
            data-cy={`question-${question.order}`}
          />
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
            formControl={hookForm}
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
        control={hookForm.control}
        description={question.content}
      />
    );

    // return <TimeForm name={question.id} formControl={hookForm} />;
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
