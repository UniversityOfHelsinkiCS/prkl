import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import Question from "./components/Question";
import { Container } from "semantic-ui-react"
import { BrowserRouter as Router, Link } from "react-router-dom"

import "./App.css"
import QuestionForm from "./components/QuestionForm"

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Header />
      <div className="mainContent">
        <StudentInfo />
        <Question />
      </div>
=======
      <Router>
        <Header />
        <div className="mainContent">
          <StudentInfo />
          <QuestionForm />
        </div>
      </Router>
>>>>>>> 42940fcd6ddde44af0480ba732a742e7df56d0c8
    </div>
  )
}

export default App
