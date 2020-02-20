import React, { useState } from "react"
import { Form, Input, Radio, Segment } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"

const QuestionForm = ({ questionId, setQuestions, questions }) => {
  const intl = useIntl()

  const [options, setOptions] = useState([])
  const [question, setQuestion] = useState({
    questionType: "singleChoice",
    content: "",
    order: questionId
  })

  const handleOptionChange = index => (e, { value }) => {
    const newOptions = options
    console.log("options:", options)
    newOptions[index] = { ...newOptions[index], content: value }
    setOptions(newOptions)

    const questionObject = {
      ...question,
      questionChoices: newOptions
    }
    let newQuestions = [...questions]
    console.log("newQuestions:", newQuestions)

    newQuestions[questionId] = questionObject
    setQuestion(questionObject)
    setQuestions(newQuestions)
  }

  const handleTypeChange = value => {
    let questionObject = { ...question, questionType: value }
    if (value === "freeForm") {
      delete questionObject.questionChoices
    }

    let newQuestions = [...questions]
    newQuestions[questionId] = questionObject
    setQuestion(questionObject)
    setQuestions(newQuestions)
  }

  const handleTitleChange = (e, { value }) => {
    const questionObject = { ...question, content: value }
    let newQuestions = [...questions]
    newQuestions[questionId] = questionObject
    setQuestion(questionObject)
    setQuestions(newQuestions)
  }

  const handleAddForm = () => {
    setOptions([...options, { order: options.length + 1, content: "" }])
    console.log("options:", [
      ...options,
      { order: options.length + 1, content: "" }
    ])
  }
  const handleRemoveForm = () => {
    setOptions(options.slice(0, options.length - 1))
  }

  return (
    <Segment style={{ padding: 15, margin: 10 }}>
      <Form.Field
        required
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
        <label>
          <FormattedMessage id="questionForm.questionTypeLabel" />
        </label>
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.numericalQuestion"
          })}
          value="singleChoice"
          checked={question.questionType === "singleChoice"}
          onChange={() => handleTypeChange("singleChoice")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.multipleSelectOne"
          })}
          value="multipleChoice"
          checked={question.questionType === "multipleChoice"}
          onChange={() => handleTypeChange("multipleChoice")}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: "questionForm.freeformQuestion"
          })}
          value="freeForm"
          checked={question.questionType === "freeForm"}
          onChange={() => handleTypeChange("freeForm")}
        />
      </Form.Group>
      {question.questionType !== "freeForm" ? (
        <>
          <Form.Group>
            <Form.Button type="button" onClick={handleAddForm} color="green">
              <FormattedMessage id="questionForm.addQuestion" />
            </Form.Button>

            <Form.Button type="button" onClick={handleRemoveForm} color="red">
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
