import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"

import CourseForm from "./components/courseCreation/CourseForm"

import Courses from "./components/courses/Courses"
import Course from "./components/courses/Course"

import { BrowserRouter as Router, Route } from "react-router-dom"

import "./App.css"

const App = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "Course 1", description: "Course for epic gamers" },
    { id: 2, title: "Tira", description: "Helppo lasten kurssi" },
    { id: 3, title: "Alon", description: "Tira 2" },
    { id: 4, title: "JTKT", description: "Send help" },
    { id: 5, title: "Course 2", description: "Course for n00b gamers" }
  ])
  const courseById = id => {
    const result = courses.find(course => course.id === Number(id))
    return result
  }
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <div className="mainContent">
          <Route path="/user" render={() => <StudentInfo />} />
          <Route path="/addcourse" render={() => <CourseForm />} />
          <Route
            exact
            path="/courses"
            render={() => <Courses courses={courses} />}
          />
          <Route
            exact
            path="/courses/:id"
            render={({ match }) => (
              <Course course={courseById(match.params.id)} />
            )}
          />
        </div>
      </Router>
    </div>
  )
}

export default App
