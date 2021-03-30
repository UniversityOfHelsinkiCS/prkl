import React, { useEffect } from 'react';
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';

import { ALL_COURSES } from './GqlQueries';

import CourseForm from './components/courses/CourseForm';
import PrivateRoute from './components/ui/PrivateRoute';
import UserInfo from './components/users/UserInfo';
import KeepAlive from './components/misc/KeepAlive';
import Courses from './components/courses/Courses';
import Course from './components/courses/Course';
import userService from './services/userService';
import Users from './components/users/Users';
import MockBar from './components/MockBar';
import DevBar from './components/DevBar';
import Header from './components/Header';
import roles from './util/userRoles';
import './App.css';
import Notification from './components/ui/Notification';

createStore('grouplessStudentsStore', []);
createStore('groupsUnsavedStore', false);
createStore('lockedGroupsStore', []);
createStore('toggleStore', false);
createStore('coursesStore', []);
createStore('teacherStore', []);
createStore('groupsStore', []);
createStore('userStore', {});
createStore('notificationStore', {});

export default () => {
  const [user, setUser] = useStore('userStore');
  // eslint-disable-next-line no-unused-vars
  const [courses, setCourses] = useStore('coursesStore');
  const [mocking] = useStore('mocking');

  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);

  userService(useQuery, useEffect, setUser);

  useEffect(() => {
    initShibbolethPinger();
  }, []);

  useEffect(() => {
    if (!courseLoading) {
      if (courseError !== undefined) {
        // eslint-disable-next-line no-console
        console.log('error:', courseError);
      } else {
        setCourses((courseData && courseData.courses) || []);
      }
    }
  }, [courseData, courseError, courseLoading, setCourses]);

  return (
    <>
      {process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? <DevBar /> : null}
      {mocking.mockedBy ? <MockBar /> : null}
      <div className="App">
        <Notification />
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          {courseLoading && user ? (
            <Loader active data-cy="loader" />
          ) : (
            <div className="mainContent">
              <Loader />
              <Route path="/user" render={() => <UserInfo courses={courses} user={user} />} />
              <PrivateRoute
                path="/addcourse"
                requiredRole={roles.STAFF_ROLE}
                render={() => <CourseForm />}
              />
              <PrivateRoute
                path="/usermanagement"
                requiredRole={roles.ADMIN_ROLE}
                render={() => <Users />}
              />
              <Route
                exact
                path="/course/:id/:subpage?"
                render={({ match }) => <Course id={match.params.id} match={match} />}
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
