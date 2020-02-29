import React from 'react';
import { Segment, Grid, Form } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import ValidatedInput from '../forms/ValidatedInput';

const Question = ({ question, hookForm }) => {
  const intl = useIntl();

  const changeType = () => {
    switch (question.questionType) {
      case 'freeForm':
        return (
          <ValidatedInput
            name={question.id}
            type={Form.Input}
            placeholder={intl.formatMessage({ id: 'course.freeFormPlaceholder' })}
            formControl={hookForm}
          />
        );
      case 'singleChoice':
        return (
          <ValidatedInput
            name={question.id}
            placeholder={intl.formatMessage({ id: 'course.multipleChoicePlaceholder' })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.id,
              text: choice.content,
            }))}
            formControl={hookForm}
            type={Form.Dropdown}
            selection
          />
        );
      case 'multipleChoice':
        return (
          <ValidatedInput
            name={question.id}
            placeholder={intl.formatMessage({ id: 'course.multipleChoicePlaceholder' })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.id,
              text: choice.content,
            }))}
            formControl={hookForm}
            type={Form.Dropdown}
            selection
            multiple
          />
        );
      default: return null;
    }
  };

  return (
    <div style={{ paddingTop: 5, paddingBottom: 5 }}>
      <Segment key={question.content} raised>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column verticalAlign="middle">
              <b>{question.content}</b>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Form.Field>
                {changeType()}
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default Question;
