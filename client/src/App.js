import React, { useEffect } from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import { createStore, useStore } from "react-hookstore"
import { useQuery } from "@apollo/react-hooks"
import { BrowserRouter as Router, Route } from "react-router-dom"

import CourseForm from "./components/courseCreation/CourseForm"
import Courses from "./components/courses/Courses"
import Course from "./components/courses/Course"
import { ALL_COURSES, CURRENT_USER } from "./GqlQueries"
import { Loader, Dimmer, Container } from "semantic-ui-react"
import DevBar from "./admin/DevBar"
import { roles } from "./util/user_roles"

import "./App.css"
import Home from "./components/Home"

createStore("coursesStore", [
  // {
  //   title: "Title",
  //   id: "811775c8-fbe0-4385-bb02-78f4fbbc4937",
  //   description: "description",
  //   code: "Code",
  //   minGroupSize: 1,
  //   maxGroupSize: 9,
  //   deadline: "2020-02-12",
  //   questions: [
  //     {
  //       questionType: "singleChoice",
  //       title: "Single choice",
  //       options: [
  //         { content: "scoice 1", value: 1 },
  //         { content: "scoice 2", value: 2 }
  //       ]
  //     },
  //     {
  //       questionType: "multipleChoice",
  //       title: "Multiple choice",
  //       options: [
  //         { content: "msoice 1", value: 1 },
  //         { content: "mshoice 2", value: 2 }
  //       ]
  //     },
  //     {
  //       questionType: "freeForm",
  //       title: "Freeform question"
  //     }
  //   ]
  // }
])
createStore("userStore", {})

const App = () => {
  const [courses, setCourses] = useStore("coursesStore")
  const [user, setUser] = useStore("userStore")

  const {
    loading: courseLoading,
    error: courseError,
    data: courseData
  } = useQuery(ALL_COURSES)

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    CURRENT_USER
  )

  const ADMIN_ROLE = 3

  useEffect(() => {
    if (!userLoading) {
      console.log("data:", userData)
      console.log("loading:", userLoading)

      if (userError !== undefined) {
        console.log("error:", userError)
      } else {
        setUser(userData.currentUser)
      }
    }
  }, [userLoading])

  useEffect(() => {
    if (!courseLoading) {
      console.log("data:", courseData)
      console.log("loading:", courseLoading)
      console.log("error:", courseError)

      if (userError !== undefined) {
        console.log("error:", courseError)
      } else {
        setCourses((courseData && courseData.courses) || [])
      }
    }
  }, [courseLoading])

  return (
    <>
      {process.env.NODE_ENV === "development" ? <DevBar /> : null}
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          {courseLoading ? (
            <Loader active />
          ) : (
            <div className="mainContent">
              <Loader></Loader>
              <Route exact path="/" render={() => <Home />} />
              <Route path="/user" render={() => <StudentInfo userLoading={userLoading}/>} />
              {user && user.role === roles.ADMIN_ROLE ? (
                <Route path="/addcourse" render={() => <CourseForm />} />
              ) : null}

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
    </>
  )
}

export default App
