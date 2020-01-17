import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import Courses from "./components/Courses"
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
          <Route path="/user" render={() => <StudentInfo />} />

          <Route path="/addcourse" render={() => <QuestionForm />} />
          <Route path="/courses" render={() => <Courses />} />
        </div>
      </Router>
    </div>
  )
}

export default App
