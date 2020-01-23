import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
<<<<<<< HEAD
import Question from "./components/Question";
import CourseFrom from "./components/courseCreation/CourseForm"
import QuestionCreationForm from "./components/courseCreation/QuestionCreationForm"
=======
import Courses from "./components/Courses"
>>>>>>> 909f115e51cc03bc79328d633ee22737ceeb2674
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
<<<<<<< HEAD

          <Route exact path="/user" render={() => <StudentInfo />} />
          <Route exact path="/addcourse" render={() => <CourseFrom />} />

=======
          <Route path="/user" render={() => <StudentInfo />} />

          <Route path="/addcourse" render={() => <QuestionForm />} />
          <Route path="/courses" render={() => <Courses />} />
>>>>>>> 909f115e51cc03bc79328d633ee22737ceeb2674
        </div>
      </Router>
    </div>
  )
}

export default App
