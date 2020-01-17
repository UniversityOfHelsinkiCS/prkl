import React, { useState } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { Container } from "semantic-ui-react"
import { BrowserRouter as Router, Link } from "react-router-dom"

import "./App.css"
import QuestionForm from "./components/QuestionForm"

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="mainContent">
          <StudentInfo />
          <QuestionForm />
        </div>
      </Router>
    </div>
  )
}

export default App
