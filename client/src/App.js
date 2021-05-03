import React, { createContext, useEffect } from 'react';
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, useStore } from 'react-hookstore';
import { useQuery } from '@apollo/client';
import { useLoaderStyle } from './styles/ui/Loader';

import { CURRENT_USER } from './GqlQueries';

import CourseForm from './components/courses/CourseForm';
import Notification from './components/ui/Notification';
import PrivateRoute from './components/ui/PrivateRoute';
import KeepAlive from './components/misc/KeepAlive';
import UserInfo from './components/users/UserInfo';
import Courses from './components/courses/Courses';
import Course from './components/courses/Course';
import Users from './components/users/Users';
import MockBar from './components/MockBar';
import DevBar from './components/DevBar';
import Header from './components/Header';
import roles from './util/userRoles';
import './App.css';

import { CircularProgress } from '@material-ui/core';

createStore('grouplessStudentsStore', []);
createStore('groupsUnsavedStore', false);
createStore('lockedGroupsStore', []);
createStore('teacherStore', []);
createStore('groupsStore', []);

export const AppContext = createContext();

export default () => {
  // eslint-disable-next-line no-unused-vars
  const [mocking] = useStore('mocking');
  const loaderClass = useLoaderStyle();

  const { loading: userLoading, error: userError, data: userData } = useQuery(CURRENT_USER);

  useEffect(() => {
    initShibbolethPinger();
  }, []);

  if (userLoading || !userData) {
    return <CircularProgress data-cy="loader" className={loaderClass.root} />;
  }

  const user = userData.currentUser;

  return (
    <AppContext.Provider value={{ user }}>
      {process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? <DevBar /> : null}
      {mocking.mockedBy ? <MockBar /> : null}

      <div className="App">
        <Notification />
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          <div className="mainContent">
            <Route path="/user" render={() => <UserInfo />} />
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
        </Router>
        <KeepAlive />
      </div>
    </AppContext.Provider>
  );
};
