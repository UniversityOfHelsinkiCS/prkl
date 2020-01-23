import React, { useState } from "react"
import { Button, Form, Input } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const QuestionForm = () => {
  const [questionText, setQuestionText] = useState("")

  const handleSubmit = () => {
    console.log('do nothing');

  }
  return (
    <div>


      <Form>
        <div>
          <label>{
            <FormattedMessage id="QuestionForm.addNewQuestion"></FormattedMessage>
          }</label>
        </div>
        <div>
          <Input type="courseCode" onChange={event => setQuestionText(event.target.value)}></Input>
        </div>
      </Form>
    </div>
  )
}

export default QuestionForm
