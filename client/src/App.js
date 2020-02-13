import React, { useEffect } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { createStore, useStore } from "react-hookstore"
import { useQuery } from "@apollo/react-hooks"
import { BrowserRouter as Router, Route } from "react-router-dom"

import CourseForm from "./components/courseCreation/CourseForm"
import Courses from "./components/courses/Courses"
import Course from "./components/courses/Course"
import { ALL_COURSES } from "./GqlQueries"
import { Loader, Dimmer, Container } from "semantic-ui-react"

import "./App.css"
import Home from "./components/Home"

createStore("coursesStore", [])

const App = () => {
  const [courses, setCourses] = useStore("coursesStore")

  const { loading, error, data } = useQuery(ALL_COURSES)

  useEffect(() => {}, [])

  useEffect(() => {
    if (!loading) {
      setCourses((data && data.courses) || [])
    }
  }, [loading])

  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        {loading ? (
          <Loader active />
        ) : (
          <div className="mainContent">
            <Loader></Loader>
            <Route exact path="/" render={() => <Home />} />
            <Route path="/user" render={() => <StudentInfo />} />
            <Route path="/addcourse" render={() => <CourseForm />} />
            <Route exact path="/courses" render={() => <Courses />} />
            <Route
              exact
              path="/courses/:id"
              render={({ match }) => <Course id={match.params.id} />}
            />
          </div>
        )}
      </Router>
    </div>
  )
}

export default App
