import React, { useState, useEffect } from "react"
import { COURSE_BY_ID, DELETE_COURSE } from "../../GqlQueries"

import { useStore } from "react-hookstore"
import { useHistory } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"

import {
  Segment,
  Header,
  Grid,
  Dropdown,
  Button,
  Form,
  Loader,
  Checkbox
} from "semantic-ui-react"
import { FormattedMessage, useIntl, FormattedDate } from "react-intl"

const Course = ({ id }) => {
  const [courses, setCourses] = useStore("coursesStore")
  const [user] = useStore("userStore")
  const [course, setCourse] = useState({})
  const [checkbox, setCheckbox] = useState(false)
  const [goals, setGoals] = useState({})
  const [answers, setAnswers] = useState([])

  const [deleteCourse] = useMutation(DELETE_COURSE)

  const history = useHistory()

  const intl = useIntl()

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id }
  })

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse(data.course)
      console.log("course: ", data.course)
      setAnswers(data.course.questions)
    }
  }, [loading])

  const handleFormSubmit = (data, value) => {
    console.log("data:", data)
    console.log("value:", value)
    answers.forEach(answer => {
      if (answer.value === undefined) {
        console.log("Et vastannut kaikkiin")
        return
      }
    })
    if (!checkbox) {
      console.log("No bueno")
    } else {
      console.log("Much bueno")
    }
    console.log("answers:", answers)
  }

  if (error !== undefined) {
    console.log("error:", error)
    return <div>Error loading course</div>
  }

  if (loading || !course) {
    return <Loader active />
  }

  const handleDeletion = async () => {
    const variables = { id: id }

    try {
      const result = await deleteCourse({
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

  return (
    <div>
      <h2>
        {course.code} - {course.title}
      </h2>

      {user && user.role === 3 ? (
        <Form.Button primary onClick={handleDeletion}>
          <FormattedMessage id="course.delete" />
        </Form.Button>
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
            console.log("index:", index)
            return (
              <Segment key={question.content} raised>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column verticalAlign="middle">
                      <b>{question.content}</b>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                      <Form.Field required>
                        <Form.Dropdown
                          required
                          selection
                          placeholder={intl.formatMessage({
                            id: "course.multipleChoicePlaceholder"
                          })}
                          options={[
                            { key: 5, value: 5, text: 5 },
                            { key: 4, value: 4, text: 4 },
                            { key: 3, value: 3, text: 3 },
                            { key: 2, value: 2, text: 2 },
                            { key: 1, value: 1, text: 1 }
                          ]}
                          onChange={(event, value) => {
                            answers[index].value = value.value
                          }}
                        ></Form.Dropdown>
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            )
          })}

        <h3>
          <FormattedMessage id="course.gradeQuestion" />
        </h3>
        <Form.Dropdown
          selection
          placeholder={intl.formatMessage({
            id: "course.multipleChoicePlaceholder"
          })}
          options={[
            {
              key: 1,
              value: 1,
              text: intl.formatMessage({ id: "course.gradeAnswer1" })
            },
            {
              key: 2,
              value: 2,
              text: intl.formatMessage({ id: "course.gradeAnswer2" })
            },
            {
              key: 3,
              value: 3,
              text: intl.formatMessage({ id: "course.gradeAnswer3" })
            }
          ]}
        ></Form.Dropdown>

        {/* <div style={{ paddingTop: 20 }}> */}
        <Form.Checkbox
          required
          // onChange={event => {
          //   setCheckbox(!checkbox)
          // }}
          label={{
            children: intl.formatMessage({ id: "course.dataCheckbox" })
          }}
        ></Form.Checkbox>
        {/* </div> */}
        {/* <div style={{ paddingTop: 20 }}> */}
        <Form.Button primary type="submit">
          <FormattedMessage id="course.confirm" />
        </Form.Button>
        {/* </div> */}
      </Form>
    </div>
  )
}
export default Course
