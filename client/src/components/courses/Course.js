import React, { useState, useEffect } from "react"
import { flatten } from "ramda"

import {
  COURSE_BY_ID,
  DELETE_COURSE,
  REGISTER_TO_COURSE
} from "../../GqlQueries"
import { useStore } from "react-hookstore"
import { useHistory } from "react-router-dom"
import { roles } from "../../util/user_roles"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { Header, Button, Form, Loader } from "semantic-ui-react"
import { FormattedMessage, useIntl, FormattedDate } from "react-intl"
import Question from "./Question"

const Course = ({ id }) => {
  const [courses, setCourses] = useStore("coursesStore")
  const [user] = useStore("userStore")
  const [course, setCourse] = useState({})
  const [checkbox, setCheckbox] = useState(false)
  const [createRegistration] = useMutation(REGISTER_TO_COURSE)

  const [deleteCourse] = useMutation(DELETE_COURSE)

  const history = useHistory()

  const intl = useIntl()

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id }
  })

  let gradeQuestion = {
    questionType: "singleChoice",
    content: intl.formatMessage({ id: "gradeQuestion.title" }),
    id: "gradeQuestionId",
    questionChoices: [
      {
        order: 1,
        content: intl.formatMessage({ id: "gradeQuestion.gradeAnswer1" }),
        id: "gradeAnswer1"
      },
      {
        order: 2,
        content: intl.formatMessage({ id: "gradeQuestion.gradeAnswer2" }),
        id: "gradeAnswer2"
      },
      {
        order: 3,
        content: intl.formatMessage({ id: "gradeQuestion.gradeAnswer3" }),
        id: "gradeAnswer3"
      }
    ]
  }

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course
        //questions: data.course.questions.concat(gradeQuestion)
      })
    }
  }, [loading])

  const handleFormSubmit = async () => {
    gradeQuestion.order = course.questions.length
    let answer = {}
    answer.courseId = course.id
    answer.questionAnswers = course.questions.map(question => {
      if (question.questionType === "freeForm") {
        return {
          questionId: question.id,
          content: question.answer
        }
      } else {
        return {
          questionId: question.id,
          answerChoices: flatten([question.answer]).map(x => ({ id: x }))
        }
      }
    })
    console.log("submitanswer:", answer)
    try {
      await createRegistration({
        variables: { data: answer }
      })
    } catch (error) {
      console.log("error:", error)
    }
  }

  if (error !== undefined) {
    console.log("error:", error)
    return <div>Error loading course</div>
  }

  if (loading || !course) {
    return <Loader active />
  }

  const handleDeletion = async () => {
    const variables = { id }

    try {
      await deleteCourse({
        variables
      })
      const trimmedCourses = []

      courses.forEach(course => {
        if (course.id !== id) {
          trimmedCourses.push(course)
        }
      })
      setCourses(trimmedCourses)
    } catch (error) {
      console.log("error:", error)
    }
    history.push("/courses")
  }

  const submitButtonDisabled = () => {
    const found = user.registrations.find(r => r.course.id === course.id)
    console.log("user:", user)
    console.log("found:", found)

    if (found === undefined && checkbox) {
      return false
    }
    console.log("no registration 4 u")
    return true
  }

  return (
    <div>
      <h2>
        {course.code} - {course.title}
      </h2>

      {user && user.role === roles.ADMIN_ROLE ? (
        <Button onClick={handleDeletion} color="red">
          <FormattedMessage id="course.delete" />
        </Button>
      ) : null}

      <Header as="h4" color="red">
        <FormattedMessage id="course.deadline" />
        <FormattedDate value={course.deadline} />
      </Header>
      <div>{course.description}</div>
      <h3>
        <FormattedMessage id="course.questionsPreface" />
      </h3>
      <Form onSubmit={handleFormSubmit}>
        {course.questions &&
          course.questions.map((question, index) => {
            return (
              <Question
                key={question.id}
                question={question}
                index={index}
                answers={course.questions}
              />
            )
          })}

        <Form.Checkbox
          required
          label={{
            children: intl.formatMessage({ id: "course.dataCheckbox" })
          }}
          onClick={() => setCheckbox(!checkbox)}
        ></Form.Checkbox>

        <Form.Button primary type="submit" disabled={submitButtonDisabled()}>
          <FormattedMessage id="course.confirm" />
        </Form.Button>
      </Form>
    </div>
  )
}
export default Course
