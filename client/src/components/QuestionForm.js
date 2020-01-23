import React, { useState } from "react"
import { Button, Form } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const QuestionForm = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const handleClick = () => {
    setShowQuestionForm(!showQuestionForm)
  }
  return (
    <div>
      <Form>
        <Button onClick={handleClick}>
          <FormattedMessage id="questionForm.addNewQuestion"></FormattedMessage>
        </Button>
      </Form>
    </div>
  )
}

export default QuestionForm
