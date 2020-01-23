import React, { useState } from "react"
import { Input, Form, Button } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"
import QuestionCreationForm from "./QuestionCreationForm"


const CourseFrom = () => {
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [courseCode, setCourseCode] = useState("")
    const [questionText, setQuestionText] = useState("")
    const [questions, setQuestions] = useState([])



    const handleSubmit = () => {
        if (courseTitle && courseDescription && courseCode) {
            const courseObject = {
                title: courseTitle,
                description: courseDescription,
                code: courseCode
            }
            console.log('courseObject: ', courseObject);
        }
    }

    const handleAddQuestion = () => {
        if (questionText != "") {
            setQuestions(questions.concat(questionText))
            setQuestionText("")
        }
    }

    return (
        <div>
            <h1><FormattedMessage id="courseCreationForm.PageTitle"></FormattedMessage></h1>

            <Form.Field >
                <div>
                    <label >{<FormattedMessage id="courseCreationForm.TitleForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input fluid type="courseTitle" onChange={event => setCourseTitle(event.target.value)}></Input>
                </div>

            </Form.Field>

            <Form.Field>
                <div>
                    <label>{<FormattedMessage id="courseCreationForm.CourseDescriptionForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input fluid type="courseDescription" onChange={event => setCourseDescription(event.target.value)}></Input>
                </div>
            </Form.Field>
            <Form.Field>
                <div>
                    <label>{<FormattedMessage id="courseCreationForm.CourseCodeForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input type="courseCode" onChange={event => setCourseCode(event.target.value)}></Input>
                </div>
            </Form.Field>
            <div>
                <Form.Field >
                    <div>
                        <label>
                            <FormattedMessage id="questionCreationForm.addNewQuestion"></FormattedMessage>
                        </label>
                    </div>
                    <div>
                        <Input fluid onChange={event => setQuestionText(event.target.value)} value={questionText} />
                    </div>

                    <Button onClick={handleAddQuestion}>
                        <FormattedMessage id="questionForm.addNewQuestion"></FormattedMessage>
                    </Button>
                </Form.Field>
            </div>

            <div>
                <Form.Button onClick={handleSubmit}>{<FormattedMessage id="courseCreationForm.ConfirmButton"></FormattedMessage>}</Form.Button>
            </div>

        </div>
    )
}

export default CourseFrom