import React from "react"
import { Segment, Grid, Form } from "semantic-ui-react"
import { useIntl, FormattedMessage } from "react-intl"

const Question = ({ question, index, answers }) => {
  const intl = useIntl()

  const changeType = () => {
    switch (question.questionType) {
      case "freeForm":
        return (
          <Form.TextArea
            onChange={(e, { value }) => (answers[index].answer = value)}
            required
            placeholder={intl.formatMessage({
              id: "course.freeFormPlaceholder"
            })}
          />
        )
      case "singleChoice":
        return (
          <Form.Dropdown
            required
            selection
            placeholder={intl.formatMessage({
              id: "course.multipleChoicePlaceholder"
            })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.order,
              text: choice.content
            }))}
            onChange={(event, { value }) => {
              answers[index].answer =
                question.questionChoices[value - 1].id
            }}
          ></Form.Dropdown>
        )
      case "multipleChoice":
        return (
          <Form.Dropdown
            multiple selection
            required
            selection
            placeholder={intl.formatMessage({
              id: "course.multipleChoicePlaceholder"
            })}
            options={question.questionChoices.map(choice => ({
              key: choice.id,
              value: choice.order,
              text: choice.content
            }))}
            onChange={(event, { value }) => {

              answers[index].answer = value.map(v =>
                question.questionChoices[v - 1].id)
            }}
          ></Form.Dropdown>
        )
      default: return null

    }
  }

  return (
    <div style={{ paddingTop: 5, paddingBottom: 5 }}>
      {/* {index === answers.length - 1 ? (
        <h3 style={{ paddingTop: 10 }}>
          <FormattedMessage id="course.gradeQuestion" />
        </h3>
      ) : null} */}
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
  )
}

export default Question
