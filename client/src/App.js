import React, { useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import Header from './components/Header';
import StudentInfo from './components/StudentInfo';
import CourseForm from './components/courseCreation/CourseForm';
import Courses from './components/courses/Courses';
import Course from './components/courses/Course';
import { ALL_COURSES } from './GqlQueries';
import DevBar from './admin/DevBar';
import roles from './util/user_roles';
import userService from './services/userService';
import './App.css';
import KeepAlive from './components/misc/KeepAlive';

createStore('coursesStore', []);
createStore('userStore', {});

export default () => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user, setUser] = useStore('userStore');

  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);

  userService(useQuery, useEffect, setUser);

  useEffect(() => {
    if (!courseLoading) {
      if (courseError !== undefined) {
        console.log('error:', courseError);
      } else {
        setCourses((courseData && courseData.courses) || []);
      }
    }
  }, [courseData, courseError, courseLoading, setCourses]);

  return (
    <>
      {process.env.NODE_ENV === 'development' ? <DevBar /> : null}
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          {courseLoading && user ? (
            <Loader active />
          ) : (
            <div className="mainContent">
              <Loader />
              <Route path="/user" render={() => <StudentInfo />} />
              {user.role === roles.ADMIN_ROLE ? (
                <Route path="/addcourse" render={() => <CourseForm />} />
              ) : null}
              <Route
                exact
                path="/course/:id"
                render={({ match }) => <Course id={match.params.id} />}
              />
              <Route exact path={['/', '/courses']} component={Courses} />
            </div>
          )}
        </Router>
        <KeepAlive />
      </div>
    </>
  );
};
