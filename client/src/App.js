import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { createStore, useStore } from "react-hookstore"

import CourseForm from "./components/courseCreation/CourseForm"

import Courses from "./components/courses/Courses"
import Course from "./components/courses/Course"

import { BrowserRouter as Router, Route } from "react-router-dom"

import "./App.css"

const App = () => {
  createStore("coursesStore", [
    {
      id: 1,
      title: "Course 1",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Course for epic gamers"
    },
    {
      id: 2,
      title: "Tira",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Helppo lasten kurssi"
    },
    {
      id: 3,
      title: "Alon",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Tira 2"
    },
    {
      id: 4,
      title: "JTKT",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Send help"
    },
    {
      id: 5,
      title: "Course 2",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Course for n00b gamers"
    },
    {
      id: 6,
      title: "Course 1",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Course for epic gamers"
    },
    {
      id: 7,
      title: "Tira",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Helppo lasten kurssi"
    },
    {
      id: 8,
      title: "Alon",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Tira 2"
    },
    {
      id: 9,
      title: "JTKT",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Send help"
    },
    {
      id: 10,
      title: "Course 2",
      questions: ["ooks jonne", "juoks es", "osaatko koodaa"],
      description: "Course for n00b gamers"
    }
  ])
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
