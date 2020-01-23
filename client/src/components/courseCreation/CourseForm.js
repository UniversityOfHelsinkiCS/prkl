import React, { useState } from "react"
import { Menu, Button, Input, Form, Select, TextArea } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"
import QuestionCreationForm from "./QuestionCreationForm"


const CourseFrom = () => {
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [courseCode, setCourseCode] = useState("")



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

    return (
        <div>
            <h1><FormattedMessage id="CourseCreationForm.PageTitle"></FormattedMessage></h1>

            <Form.Field >
                <div>
                    <label >{<FormattedMessage id="CourseCreationForm.TitleForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input fluid type="courseTitle" onChange={event => setCourseTitle(event.target.value)}></Input>
                </div>

            </Form.Field>

            <Form.Field>
                <div>
                    <label>{<FormattedMessage id="CourseCreationForm.CourseDescriptionForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input fluid type="courseDescription" onChange={event => setCourseDescription(event.target.value)}></Input>
                </div>
            </Form.Field>
            <Form.Field>
                <div>
                    <label>{<FormattedMessage id="CourseCreationForm.CourseCodeForm"></FormattedMessage>}</label>
                </div>
                <div>
                    <Input type="courseCode" onChange={event => setCourseCode(event.target.value)}></Input>
                </div>
            </Form.Field>
            <div>
                <QuestionCreationForm />
            </div>

            <div>
                <Form.Button onClick={handleSubmit}>{<FormattedMessage id="CourseCreationForm.ConfirmButton"></FormattedMessage>}</Form.Button>
            </div>

        </div>
    )
}

export default CourseFrom