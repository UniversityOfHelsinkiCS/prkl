import React, { useState } from "react"
import { Form, Input, Radio, Segment } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"

const QuestionForm = ({ questionId, setQuestions }) => {
  const intl = useIntl()
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState([{}])
  const [questionType, setQuestionType] = useState("0")

  const handleAddForm = () => {
    setOptions([...options, { content: "" }])
  }
  const handleRemoveForm = () => {
    setOptions(options.slice(0, options.length - 1))
  }

  const handleTypeChange = type => {
    setQuestionType(type)
  }
  return (
    <Segment style={{ padding: 15, margin: 10 }}>
      <Form.Field
        control={Input}
        label={intl.formatMessage({
          id: "questionForm.title"
        })}
        placeholder={intl.formatMessage({
          id: "questionForm.titlePlaceholder"
        })}
      />
      <Form.Group inline>
        <label>Question Type</label>
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.numericalQuestion"
          })}
          value="0"
          checked={questionType === "0"}
          onChange={() => handleTypeChange("0")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.multipleSelectOne"
          })}
          value="1"
          checked={questionType === "1"}
          onChange={() => handleTypeChange("1")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.freeformQuestion"
          })}
          value="2"
          checked={questionType === "2"}
          onChange={() => handleTypeChange("2")}
        />
      </Form.Group>
      {questionType !== "2" ? (
        <>
          <Form.Group>
            <Form.Button type="button" onClick={handleAddForm}>
              <FormattedMessage id="questionForm.addQuestion" />
            </Form.Button>

            <Form.Button type="button" onClick={handleRemoveForm}>
              <FormattedMessage id="questionForm.removeQuestion" />
            </Form.Button>
          </Form.Group>

          <Form.Group style={{ flexWrap: "wrap" }}>
            {options.map((q, index) => (
              <Form.Field
                control={Input}
                type="text"
                label={intl.formatMessage(
                  {
                    id: "questionForm.optionTitle"
                  },
                  {
                    number: index + 1
                  }
                )}
                key={`question${questionId}optionsForm${index}`}
                placeholder={intl.formatMessage(
                  {
                    id: "questionForm.optionTitle"
                  },
                  {
                    number: index + 1
                  }
                )}
              />
            ))}
          </Form.Group>
        </>
      ) : null}
    </Segment>
  )
}

export default QuestionForm
