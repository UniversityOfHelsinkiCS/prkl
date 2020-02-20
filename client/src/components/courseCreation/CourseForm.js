import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Form } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"
import { useMutation } from "@apollo/react-hooks"
import { CREATE_COURSE } from "../../GqlQueries"
import { useStore } from "react-hookstore"
import QuestionForm from "./QuestionForm"

const CourseForm = () => {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [questions, setQuestions] = useState([])
  const [maxGroup, setMaxGroup] = useState()
  const [minGroup, setMinGroup] = useState()
  const [deadline, setDeadline] = useState()
  const [courses, setCourses] = useStore("coursesStore")

  const [createCourse] = useMutation(CREATE_COURSE)

  const intl = useIntl()
  const history = useHistory()

  const today = new Date()
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()
  const todayParsed = `${yyyy}-${mm}-${dd}`

  const handleSubmit = async () => {
    const courseObject = {
      title: courseTitle,
      description: courseDescription,
      code: courseCode,
      minGroupSize: Number.parseInt(minGroup),
      maxGroupSize: Number.parseInt(maxGroup),
      deadline: new Date(deadline),
      questions
    }
    const variables = { data: { ...courseObject } }

    try {
      const result = await createCourse({
        variables
      })
      setCourses(courses.concat(result.data.createCourse))
    } catch (error) {
      console.log("error:", error)
    }

    history.push("/courses")
  }

  const handleAddForm = e => {
    e.preventDefault()
    setQuestions([...questions, { content: "" }])
  }
  const handleRemoveForm = () => {
    setQuestions(questions.slice(0, questions.length - 1))
  }

  return (
    <div>
      <h1>
        <FormattedMessage id="courseForm.pageTitle" />
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            required
            fluid
            label={intl.formatMessage({
              id: "courseForm.titleForm"
            })}
            onChange={event => setCourseTitle(event.target.value)}
          />
        </Form.Field>

        <Form.Group>
          <Form.Input
            required
            label={intl.formatMessage({
              id: "courseForm.courseCodeForm"
            })}
            onChange={event => setCourseCode(event.target.value)}
          />

          <Form.Input
            required
            type="date"
            min={todayParsed}
            label={intl.formatMessage({
              id: "courseForm.courseDeadlineForm"
            })}
            onChange={event => {
              setDeadline(event.target.value)
            }}
          />
        </Form.Group>

        <Form.Field>
          <Form.TextArea
            required
            label={intl.formatMessage({
              id: "courseForm.courseDescriptionForm"
            })}
            onChange={event => setCourseDescription(event.target.value)}
          />
        </Form.Field>

        <Form.Group>
          <Form.Input
            required
            type="number"
            min="1"
            max={maxGroup}
            label={intl.formatMessage({
              id: "courseForm.courseMinGroupForm"
            })}
            onChange={event => setMinGroup(event.target.value)}
          />

          <Form.Input
            required
            type="number"
            min={minGroup}
            label={intl.formatMessage({
              id: "courseForm.courseMaxGroupForm"
            })}
            onChange={event => setMaxGroup(event.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Button type="button" onClick={handleAddForm} color="green">
            <FormattedMessage id="courseForm.addQuestion" />
          </Form.Button>

          <Form.Button type="button" onClick={handleRemoveForm} color="red">
            <FormattedMessage id="courseForm.removeQuestion" />
          </Form.Button>
        </Form.Group>

        <Form.Group style={{ flexWrap: "wrap" }}>
          {questions.map((q, index) => (
            <QuestionForm
              key={`addQuestionField${index}`}
              setQuestions={setQuestions}
              questions={questions}
              questionId={index}
            />
          ))}
        </Form.Group>

        <Form.Button primary type="submit">
          <FormattedMessage id="courseForm.confirmButton" />
        </Form.Button>
      </Form>
    </div>
  )
}

export default CourseForm
