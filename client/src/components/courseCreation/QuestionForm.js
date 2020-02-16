import React, { useState } from "react"
import { Form, Input, Radio, Segment } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"

const QuestionForm = ({ questionId, setQuestions, questions }) => {
  const intl = useIntl()

  const [options, setOptions] = useState([{}])
  const [question, setQuestion] = useState({ questionType: "0", title: "" })

  const handleOptionChange = index => (e, { value }) => {
    const newOptions = [...options]
    newOptions[index] = { content: value }
    setOptions(newOptions)

    const questionObject = {
      ...question,
      options: newOptions
    }
    let newQuestions = [...questions]
    newQuestions[questionId] = questionObject
    setQuestion(questionObject)
    setQuestions(newQuestions)
  }

  const handleTypeChange = value => {
    let questionObject = { ...question, questionType: value }
    if (value === "2") {
      delete questionObject.options
    }

    let newQuestions = [...questions]
    newQuestions[questionId] = questionObject
    setQuestion(questionObject)
    setQuestions(newQuestions)
  }

  const handleTitleChange = (e, { value }) => {
    const questionObject = { ...question, title: value }
    let newQuestions = [...questions]
    newQuestions[questionId] = questionObject
    setQuestion(questionObject)

    setQuestions(newQuestions)
  }

  const handleAddForm = () => {
    setOptions([...options, { content: "" }])
  }
  const handleRemoveForm = () => {
    setOptions(options.slice(0, options.length - 1))
  }

  return (
    <Segment style={{ padding: 15, margin: 10 }}>
      <Form.Field
        onChange={handleTitleChange}
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
          checked={question.questionType === "0"}
          onChange={() => handleTypeChange("0")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.multipleSelectOne"
          })}
          value="1"
          checked={question.questionType === "1"}
          onChange={() => handleTypeChange("1")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.freeformQuestion"
          })}
          value="2"
          checked={question.questionType === "2"}
          onChange={() => handleTypeChange("2")}
        />
      </Form.Group>
      {question.questionType !== "2" ? (
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
                onChange={handleOptionChange(index)}
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
