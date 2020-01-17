import React, { useState } from "react"
import { Menu, Button, Form, Select, TextArea } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const Question = () => {

    const props = {
        title: "ooks jonne?",
        options: [
            { key: 1, text: 1, value: 1 },
            { key: 2, text: 2, value: 2 },
            { key: 3, text: 3, value: 3 },
            { key: 4, text: 4, value: 4 },
            { key: 5, text: 5, value: 5 },
        ],
        freeform: true,
        description: "juotko es"
    }


    return (

        <div>
            <h2>
                <FormattedMessage id="question.question"></FormattedMessage>
            </h2>

            <Form>
                <Form.Group>
                    <Form.Field defaultValue={props.options[0].text} label={props.title} control={Select} options={props.options} />
                </Form.Group>
                {props.freeform ?
                    <Form.Group>
                        <Form.Field label={props.description} control={TextArea}></Form.Field>
                    </Form.Group>
                    : null
                }

            </Form>
        </div>
    )
}

export default Question