import React from "react"

const Courses = () => {
  const courses = [
    { name: "Course 1", description: "Course for epic gamers" },
    { name: "Course 2", description: "Course for n00b gamers" }
  ]

  return (
    <div>
      {courses.map(course => (
        <div>
          <div>{course.name}</div>
          <div>{course.description}</div>
        </div>
      ))}
    </div>
  )
}

export default Courses
