import React, { useState } from "react"
import { Button, Input, Form } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const QuestionCreationForm = () => {

    const [questionText, setQuestionText] = useState("")

    const handleClick = () => {
        console.log("pressed 4head")
    }


    return (
        <Form>
            <Form.Field>


                <div>
                    <label>
                        <FormattedMessage id="questionCreationForm.addNewQuestion"></FormattedMessage>
                    </label>
                </div>
                <div>
                    <Input onChange={event => setQuestionText(event.target.value)} />
                </div>

                <Button onClick={handleClick}>
                    <FormattedMessage id="questionForm.addNewQuestion"></FormattedMessage>
                </Button>
            </Form.Field>
        </Form>
    )
}

export default QuestionCreationForm