import React from "react"
import { Segment, Input, Dropdown } from "semantic-ui-react"
import { FormattedMessage, useIntl } from "react-intl"

const Course = ({ course }) => {
  const intl = useIntl()
  return (
    <div>
      <h2>{course.title}</h2>
      <div>{course.description}</div>
      <h3>
        <FormattedMessage id="course.questionsPreface"></FormattedMessage>
      </h3>
      <strong></strong>
      {course.questions.map(question => (
        <Segment>
          <b>{question}</b>

          <Dropdown
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
          ></Dropdown>
        </Segment>
      ))}
    </div>
  )
}
export default Course
