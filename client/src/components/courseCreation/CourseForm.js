import React, { useState } from "react"
import { Form } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"
import QuestionCreationForm from "./QuestionCreationForm"
import { useStore } from "react-hookstore"

const CourseFrom = () => {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [questions, setQuestions] = useState([""])
  const [maxGroup, setMaxGroup] = useState()
  const [minGroup, setMinGroup] = useState()
  const [deadline, setDeadline] = useState()

  const [courses, setCourses] = useStore("coursesStore")

  const intl = useIntl()

  const handleSubmit = () => {
    if (courseTitle && courseDescription && courseCode) {
      const courseObject = {
        title: courseTitle,
        description: courseDescription,
        code: courseCode,
        id: 100,
        questions,
        deadline
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
          <Form.Input
            fluid
            label={intl.formatMessage({
              id: "courseCreationForm.TitleForm"
            })}
            onChange={event => setCourseTitle(event.target.value)}
          ></Form.Input>
        </Form.Field>

        <Form.Group>
          <Form.Input
            label={intl.formatMessage({
              id: "courseCreationForm.CourseCodeForm"
            })}
            onChange={event => setCourseCode(event.target.value)}
          ></Form.Input>

          <Form.Input
            type="date"
            label={intl.formatMessage({
              id: "courseCreationForm.CourseDeadlineForm"
            })}
            onChange={event => {
              setDeadline(event.target.value)
            }}
          ></Form.Input>
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            label={intl.formatMessage({
              id: "courseCreationForm.CourseDescriptionForm"
            })}
            onChange={event => setCourseDescription(event.target.value)}
          ></Form.TextArea>
        </Form.Field>

        <Form.Group>
          <Form.Input
            type="number"
            label={intl.formatMessage({
              id: "courseCreationForm.CourseMaxGroupForm"
            })}
            onChange={event => setMaxGroup(event.target.value)}
          ></Form.Input>

          <Form.Input
            type="number"
            label={intl.formatMessage({
              id: "courseCreationForm.CourseMinGroupForm"
            })}
            onChange={event => setMinGroup(event.target.value)}
          ></Form.Input>
        </Form.Group>

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
              key={index}
              onChange={handleQuestionChange(index)}
              placeholder={intl.formatMessage({
                id: "questionCreationForm.addNewQuestion"
              })}
              label={`Question number ${index + 1}`}
              value={q}
            ></Form.Input>
          ))}
        </Form.Group>

        <Form.Button primary onClick={handleSubmit}>
          <FormattedMessage id="courseCreationForm.ConfirmButton"></FormattedMessage>
        </Form.Button>
      </Form>
    </div>
  )
}

export default CourseFrom
