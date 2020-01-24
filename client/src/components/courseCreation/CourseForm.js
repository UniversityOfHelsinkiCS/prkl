import React, { useState } from "react"
import { Form, Message } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"
import { useStore } from "react-hookstore"

const CourseFrom = () => {
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [courseCode, setCourseCode] = useState("")
    const [questions, setQuestions] = useState([""])
    const [notification, setNotification] = useState("")

    const [courses, setCourses] = useStore("coursesStore")

    const intl = useIntl()

    const handleSubmit = () => {
        if (courseTitle && courseDescription && courseCode) {
            try {
                const courseObject = {
                    title: courseTitle,
                    description: courseDescription,
                    code: courseCode,
                    id: courses.length + 1,
                    questions: questions
                }

                setCourses(courses.concat(courseObject))
                setCourseTitle("")
                setCourseDescription("")
                setCourseCode("")
                setQuestions([""])
                setNotification(intl)

                setTimeout(() => {
                    setNotification("lmao")
                }, 6000)
            } catch (e) {
                setTimeout(() => {
                    setNotification("An error occurred when trying to create course, please try again.")
                }, 6000)
                console.log("exception: ", e)
            }
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
                        onChange={event => setCourseCode(event.target.value)}
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
                        onChange={event => setCourseCode(event.target.value)}
                    ></Form.Input>

                    <Form.Input
                        type="number"
                        label={intl.formatMessage({
                            id: "courseCreationForm.CourseMinGroupForm"
                        })}
                        onChange={event => setCourseCode(event.target.value)}
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
                {notification !== "" ? <div><Message positive header={notification} ></Message></div> : null}
            </Form>
        </div>
    )
}

export default CourseFrom
