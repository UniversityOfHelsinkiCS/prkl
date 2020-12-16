import React, { useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import Header from './components/Header';
import StudentInfo from './components/users/UserInfo';
import CourseForm from './components/courses/CourseForm';
import Courses from './components/courses/Courses';
import Course from './components/courses/Course';
import { ALL_COURSES } from './GqlQueries';
import DevBar from './components/DevBar';
import MockBar from './components/MockBar';
import roles from './util/userRoles';
import userService from './services/userService';
import './App.css';
import KeepAlive from './components/misc/KeepAlive';
import Users from './components/users/Users';
import PrivateRoute from './components/ui/PrivateRoute';
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session';

createStore('coursesStore', []);
createStore('groupsStore', []);
createStore('teacherStore', []);
createStore('userStore', {});
createStore('toggleStore', false);
createStore('groupsUnsavedStore', false);

export default () => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user, setUser] = useStore('userStore');
	const [mocking] = useStore('mocking');

  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);

  userService(useQuery, useEffect, setUser);

  useEffect(() => {
    initShibbolethPinger();
  }, []);

  useEffect(() => {
    if (!courseLoading) {
      if (courseError !== undefined) {
        console.log('error:', courseError);
      } else {
        setCourses((courseData && courseData.courses) || []);
      }
    }
  }, [
    courseData,
    courseError,
    courseLoading,
    setCourses
  ]);

  return (
    <>
      {process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? <DevBar /> : null}
			{mocking.mockedBy  ? <MockBar /> : null }
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          {courseLoading && user ? (
            <Loader active data-cy="loader" />
          ) : (
            <div className="mainContent">
              <Loader />
              <Route path="/user" render={() => <StudentInfo />} />
              <PrivateRoute
                path="/addcourse"
                requiredRole={roles.STAFF_ROLE}
                render={() => <CourseForm />}
              />
              <PrivateRoute
                path="/usermanagement"
                requiredRole={roles.ADMIN_ROLE}
                render={() => <Users /> }
              />
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
