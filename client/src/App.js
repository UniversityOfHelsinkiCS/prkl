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
import { ALL_COURSES, ALL_USERS } from './GqlQueries';
import DevBar from './admin/DevBar';
import roles from './util/user_roles';
import userService from './services/userService';
import './App.css';
import KeepAlive from './components/misc/KeepAlive';
import Users from './components/misc/Users';
import { dummyEmail, dummyStudentNumber } from './util/privacyDefaults';
import PrivateRoute from './components/misc/PrivateRoute';

createStore('coursesStore', []);
createStore('allUsersStore', []);
createStore('userStore', {});
createStore('toggleStore', false);

export default () => {
  const [courses, setCourses] = useStore('coursesStore');
  const [allUsers, setAllUsers] = useStore('allUsersStore');
  const [user, setUser] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');

  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);
  const { loading: allUsersLoading, error: allUsersError, data: allUsersData } = useQuery(
    ALL_USERS,
    {
      skip: user.role !== roles.ADMIN_ROLE,
    }
  );

  userService(useQuery, useEffect, setUser);

  useEffect(() => {
    if (!courseLoading) {
      if (courseError !== undefined) {
        console.log('error:', courseError);
      } else {
        setCourses((courseData && courseData.courses) || []);
      }
    }

    // for some reason, setUsers is being invoked with the new, updated users
    // after handleRoleButtonClick(). albeit this is the desired behaviour,
    // i, for one, don't know why or how it happens
    if (!allUsersLoading && allUsersData?.users !== undefined) {
      const usersToSet = privacyToggle
        ? allUsersData.users.map(u => ({ ...u, email: dummyEmail, studentNo: dummyStudentNumber }))
        : allUsersData.users;
      setAllUsers(usersToSet);
    }
  }, [
    courseData,
    courseError,
    courseLoading,
    setCourses,
    setAllUsers,
    allUsersData,
    allUsersLoading,
    privacyToggle,
  ]);

  return (
    <>
      {process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? <DevBar /> : null}
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
                render={() => (
                  <Users allUsersError={allUsersError} allUsersLoading={allUsersLoading} />
                )}
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
