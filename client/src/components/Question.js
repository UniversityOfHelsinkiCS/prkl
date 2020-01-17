import React, { useState } from "react"
import { Menu, Button, Form, Select, TextArea } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const Question = () => {

    const props = {
        title: "ooks jonne?",
        options: [
            { key: 'y', text: 'yes', value: 'yes' },
            { key: 'hy', text: "you're absolutely right sir", value: 'hy' },
            { key: 'n', text: 'no', value: 'no' },
            { key: 'm', text: 'maybe', value: 'maybe' },
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