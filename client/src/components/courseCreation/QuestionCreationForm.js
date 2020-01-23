import React, { useState } from "react"
import { Menu, Button, Input, Form, Select, TextArea } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const QuestionCreationForm = () => {

    const [questionText, setQuestionText] = useState("")

    const handleClick = () => {
        console.log("pressed 4head")
    }


    return (
        <Form>
            <Form.Field>
                <label>
                    <FormattedMessage id="questionCreationForm.addNewQuestion"></FormattedMessage>
                </label>
                <Input onChange={event => setQuestionText(event.target.value)} />

                <Button onClick={handleClick}>
                    <FormattedMessage id="questionForm.addNewQuestion"></FormattedMessage>
                </Button>
            </Form.Field>
        </Form>
    )
}

export default QuestionCreationForm