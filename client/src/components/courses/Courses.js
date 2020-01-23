import React, { useState } from "react"
import { Input, Card, Divider, Segment } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { useIntl } from "react-intl"

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
      <Divider />

      <Card.Group itemsPerRow={1}>
        <div className="coursesList">
          {courses
            .filter(course =>
              course.title.toLowerCase().includes(search.toLowerCase())
            )
            .map(course => (
              <Card
                fluid
                as={Link}
                to={`/courses/${course.id}`}
                header={course.title}
                description={course.description}
              ></Card>
            ))}
        </div>
      </Card.Group>
    </div>
  )
}

export default Courses
