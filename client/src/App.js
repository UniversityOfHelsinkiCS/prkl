import React from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"

import CourseForm from "./components/courseCreation/CourseForm"

import Courses from "./components/Courses"

import { BrowserRouter as Router, Route } from "react-router-dom"

import "./App.css"

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <div className="mainContent">
          <Route path="/user" render={() => <StudentInfo />} />
          <Route path="/addcourse" render={() => <CourseForm />} />
          <Route path="/courses" render={() => <Courses />} />
        </div>
      </Router>
    </div>
  )
}

export default App
