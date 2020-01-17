import React from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { Container } from "semantic-ui-react"

import "./App.css"

function App() {
  return (
    <div className="App">
      <Header />
      <div className="mainContent">
        <StudentInfo />
      </div>
    </div>
  )
}

export default App
