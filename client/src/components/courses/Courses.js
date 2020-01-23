import React, { useState } from "react"
import { Input, Card } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { FormattedMessage, useIntl } from "react-intl"

const Courses = ({ courses }) => {
  const [search, setSearch] = useState("")
  const handleSearchChange = event => {
    setSearch(event.target.value)
  }
  const intl = useIntl()

  return (
    <div>
      <Input
        onChange={handleSearchChange}
        placeholder={intl.formatMessage({ id: "courses.searchPlaceholder" })}
      />
      <Card.Group>
        {courses
          .filter(course =>
            course.title.toLowerCase().includes(search.toLowerCase())
          )
          .map(course => (
            <Card
              as={Link}
              to={`/courses/${course.id}`}
              fluid
              header={course.title}
              description={course.description}
            ></Card>
          ))}
      </Card.Group>
    </div>
  )
}

export default Courses
