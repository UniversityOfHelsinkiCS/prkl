import React, { useState } from "react"
import { Input } from "semantic-ui-react"
import { useIntl } from "react-intl"

const Courses = () => {
  const [courses, setCourses] = useState([
    { name: "Course 1", description: "Course for epic gamers" },
    { name: "Tira", description: "Helppo lasten kurssi" },
    { name: "Alon", description: "Tira 2" },
    { name: "JTKT", description: "Send help" },
    { name: "Course 2", description: "Course for n00b gamers" }
  ])

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

      {courses
        .filter(course =>
          course.name.toLowerCase().includes(search.toLowerCase())
        )
        .map(course => (
          <div>
            <div>
              {course.name} : {course.description}
            </div>
          </div>
        ))}
    </div>
  )
}

export default Courses
