import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import Question from "./components/Question";
import CourseFrom from "./components/courseCreation/CourseForm"
import QuestionCreationForm from "./components/courseCreation/QuestionCreationForm"
import { Container } from "semantic-ui-react"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import "./App.css"
import QuestionForm from "./components/QuestionForm"

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="mainContent">

          <Route exact path="/user" render={() => <StudentInfo />} />
          <Route exact path="/addcourse" render={() => <CourseFrom />} />

        </div>
      </Router>
    </div>
  )
}

export default App
