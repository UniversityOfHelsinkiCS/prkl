import React, { useState } from "react"
import { Input, Form, Button, FormGroup } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"
import QuestionCreationForm from "./QuestionCreationForm"
import { useStore } from "react-hookstore"

const CourseFrom = () => {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [questions, setQuestions] = useState([""])
  const [courses, setCourses] = useStore("coursesStore")

  const intl = useIntl()

  const handleSubmit = () => {
    if (courseTitle && courseDescription && courseCode) {
      const courseObject = {
        title: courseTitle,
        description: courseDescription,
        code: courseCode,
        id: 100,
        questions: questions
      }

      setCourses(courses.concat(courseObject))
    }
  }

  const handleQuestionChange = index => (e, { value }) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAddForm = () => {
    setQuestions([...questions, ""])
  }
  const handleRemoveForm = () => {
    setQuestions(questions.slice(0, questions.length - 1))
  }

  return (
    <div>
      <h1>
        <FormattedMessage id="courseCreationForm.PageTitle"></FormattedMessage>
      </h1>

      <Form>
        <Form.Field>
          <label>
            {
              <FormattedMessage id="courseCreationForm.TitleForm"></FormattedMessage>
            }
          </label>
          <Input
            fluid
            type="courseTitle"
            onChange={event => setCourseTitle(event.target.value)}
          ></Input>
        </Form.Field>

        <Form.Field>
          <label>
            {
              <FormattedMessage id="courseCreationForm.CourseDescriptionForm"></FormattedMessage>
            }
          </label>
          <Input
            fluid
            type="courseDescription"
            onChange={event => setCourseDescription(event.target.value)}
          ></Input>
        </Form.Field>

        <Form.Field>
          <label>
            {
              <FormattedMessage id="courseCreationForm.CourseCodeForm"></FormattedMessage>
            }
          </label>
          <Input
            type="courseCode"
            onChange={event => setCourseCode(event.target.value)}
          ></Input>
        </Form.Field>

        <Form.Group>
          <Form.Button onClick={handleAddForm}>
            <FormattedMessage id="questionForm.addQuestion"></FormattedMessage>
          </Form.Button>

          <Form.Button onClick={handleRemoveForm}>
            <FormattedMessage id="questionForm.removeQuestion"></FormattedMessage>
          </Form.Button>
        </Form.Group>

        <Form.Group style={{ flexWrap: "wrap" }}>
          {questions.map((q, index) => (
            <Form.Input
              onChange={handleQuestionChange(index)}
              placeholder={intl.formatMessage({
                id: "questionCreationForm.addNewQuestion"
              })}
              label={`Question number ${index + 1}`}
              value={q}
            ></Form.Input>
          ))}
        </Form.Group>

        {/* <Form.Field >
                    <label>
                        <FormattedMessage id="questionCreationForm.addNewQuestion"></FormattedMessage>
                    </label>
                    <Input fluid onChange={event => setQuestionText(event.target.value)} value={questionText} />
                </Form.Field> */}

        <Form.Button onClick={handleSubmit}>
          {
            <FormattedMessage id="courseCreationForm.ConfirmButton"></FormattedMessage>
          }
        </Form.Button>
      </Form>
    </div>
  )
}

export default CourseFrom
