import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Form } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"
import { useMutation } from "@apollo/react-hooks"
import { CREATE_COURSE } from "../../GqlQueries"
import { useStore } from "react-hookstore"

const CourseForm = () => {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [questions, setQuestions] = useState([{}])
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
    if (courseTitle && courseDescription && courseCode) {
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
        console.log("result:", result)
        setCourses(courses.concat(result.data.createCourse))
      } catch (error) {
        console.log("error:", error)
      }

      history.push("/courses")
    }
  }

  const handleQuestionChange = index => (e, { value }) => {
    const newQuestions = [...questions]
    newQuestions[index] = { content: value }
    setQuestions(newQuestions)
  }

  const handleAddForm = () => {
    setQuestions([...questions, { content: "" }])
  }
  const handleRemoveForm = () => {
    setQuestions(questions.slice(0, questions.length - 1))
  }

  return (
    <div>
      <h1>
        <FormattedMessage id="courseCreationForm.PageTitle" />
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            required
            fluid
            label={intl.formatMessage({
              id: "courseCreationForm.TitleForm"
            })}
            onChange={event => setCourseTitle(event.target.value)}
          />
        </Form.Field>

        <Form.Group>
          <Form.Input
            required
            label={intl.formatMessage({
              id: "courseCreationForm.CourseCodeForm"
            })}
            onChange={event => setCourseCode(event.target.value)}
          />

          <Form.Input
            required
            type="date"
            min={todayParsed}
            label={intl.formatMessage({
              id: "courseCreationForm.CourseDeadlineForm"
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
              id: "courseCreationForm.CourseDescriptionForm"
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
              id: "courseCreationForm.CourseMinGroupForm"
            })}
            onChange={event => setMinGroup(event.target.value)}
          />

          <Form.Input
            required
            type="number"
            min={minGroup}
            label={intl.formatMessage({
              id: "courseCreationForm.CourseMaxGroupForm"
            })}
            onChange={event => setMaxGroup(event.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Button onClick={handleAddForm}>
            <FormattedMessage id="questionForm.addQuestion" />
          </Form.Button>

          <Form.Button onClick={handleRemoveForm}>
            <FormattedMessage id="questionForm.removeQuestion" />
          </Form.Button>
        </Form.Group>

        <Form.Group style={{ flexWrap: "wrap" }}>
          {questions.map((q, index) => (
            <Form.Input
              required
              key={index}
              onChange={handleQuestionChange(index)}
              placeholder={intl.formatMessage({
                id: "questionCreationForm.addNewQuestion"
              })}
              label={`Question number ${index + 1}`}
              value={q.name}
            />
          ))}
        </Form.Group>

        <Form.Button primary type="submit">
          <FormattedMessage id="courseCreationForm.ConfirmButton" />
        </Form.Button>
      </Form>
    </div>
  )
}

export default CourseForm
