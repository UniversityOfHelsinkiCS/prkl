import React, { useState } from "react"
import { Input, Card, Divider } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { useIntl } from "react-intl"
import { useStore } from "react-hookstore"

const Courses = () => {
  const [courses] = useStore("coursesStore")
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
          {courses && courses
            .filter(
              course =>
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.code.toLowerCase().includes(search.toLowerCase())
            )
            .map(course => (
              <Card
                raised
                key={course.id}
                fluid
                as={Link}
                to={`/courses/${course.id}`}
                header={`${course.code} - ${course.title}`}
                description={`${intl.formatMessage({
                  id: "courses.deadline"
                })} ${intl.formatDate(Date.parse(course.deadline))}`}
              ></Card>
            ))}
        </div>
      </Card.Group>
    </div>
  )
}

export default Courses
