import React from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { createStore, useStore } from "react-hookstore"

import CourseForm from "./components/courseCreation/CourseForm"

import Courses from "./components/courses/Courses"
import Course from "./components/courses/Course"

import { BrowserRouter as Router, Route } from "react-router-dom"

import "./App.css"

createStore("coursesStore", [
  {
    code: "TKT20006",
    deadline: "2020-12-12",
    id: 1,
    title: "Tira",
    questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
    description: "Helppo lasten kurssi"
  },
  {
    code: "TKT20007",
    deadline: "2020-10-12",
    id: 2,
    title: "Alon",
    questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
    description: "Tira 2"
  },
  {
    code: "TKT20003",
    deadline: "2020-02-02",
    id: 3,
    title: "JTKT",
    questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
    description: "Send help"
  }
])

const App = () => {
  const [courses] = useStore("coursesStore")

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
          <Route exact path="/courses" render={() => <Courses />} />
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
