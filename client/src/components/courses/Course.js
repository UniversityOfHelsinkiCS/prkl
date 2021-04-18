import React, { useState, useEffect, useContext, createContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/client';
import { AppBar, CircularProgress, Tab } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  COURSE_BY_ID,
  DELETE_COURSE,
  COURSE_REGISTRATION,
  DELETE_REGISTRATION,
} from '../../GqlQueries';

import { BlueButton } from '../../styles/ui/Button';
import { useLoaderStyle } from '../../styles/ui/Loader';
import { useCourseStyle } from '../../styles/courses/Course';

import RegistrationList from '../registrations/RegistrationList';
import ConfirmationButton from '../ui/ConfirmationButton';
import Registration from '../registrations/Registration';
import GroupsView from '../groups/GroupsView';
import CourseForm from './CourseForm';
import CourseInfo from './CourseInfo';
import roles from '../../util/userRoles';
import { AppContext } from '../../App';

export const CourseContext = createContext();

export default ({ id, match }) => {
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [regByStudentId, setRegByStudentId] = useState([]);
  const [groups, setGroups] = useStore('groupsStore');
  const [editView, setEditView] = useState(false);
  const [course, setCourse] = useState({});
  const [view] = useState('info');
  const history = useHistory();
  const intl = useIntl();
  const { user } = useContext(AppContext);
  const loaderClass = useLoaderStyle();
  const courseClass = useCourseStyle();

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    update(cache, { data: { deleteCourse: courseId } }) {
      const success = cache.evict({
        id: cache.identify({
          __typename: 'Course',
          courseId,
        }),
      });

      if (!success) {
        // eslint-disable-next-line no-console
        console.error(`Failed to delete course ${courseId} from cache.`);
      }
    },
  });

  // Description collection of the course
  const paragraphs = course.description ? course.description.split('\n\n') : [];

  // -----------
  // | GRAPHQL |
  // -----------

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
    skip:
      course.teachers === undefined ||
      (!course.teachers.some(t => t.id === user.id) && user.role !== roles.ADMIN_ROLE),
    variables: { courseId: id },
  });

  const [deleteRegistration] = useMutation(DELETE_REGISTRATION, {
    update(cache, { data: { deleteRegistration: id } }) {
      const success = cache.evict({
        id: cache.identify({
          __typename: 'Registration',
          id,
        }),
      });

      if (!success) {
        // eslint-disable-next-line no-console
        console.error(`Failed to delete registration ${id} from cache.`);
      }
    },
  });

  // -------------
  // | useEFFECT |
  // -------------

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: [...data.course.questions].sort((a, b) => a.order - b.order),
      });
      // only show editView if course is loaded, used for routing:
      setEditView(true);
    }

    if (!regLoading && regData !== undefined) {
      const reg = regData.courseRegistrations.map(r => {
        [...r.questionAnswers].sort((a, b) => a.question.order - b.question.order);
        r.questionAnswers.forEach(qa => [...qa.answerChoices].sort((a, b) => a.order - b.order));
        return r;
      });
      setRegByStudentId(
        reg.reduce((acc, elem) => {
          acc[elem.student.studentNo] = elem;
          return acc;
        }, {})
      );
    }
  }, [data, loading, regData, regLoading]);

  if (error !== undefined) {
    // eslint-disable-next-line no-console
    console.log('error:', error);
    return (
      <div>Error loading course. Course might have been removed or it is not published yet.</div>
    );
  }

  if (loading || !course.id || regLoading) {
    return <CircularProgress className={loaderClass.root} />;
  }

  // Registrations related to the course
  const registrations = regData ? regData.courseRegistrations : undefined;

  // ------------
  // | HANDLERS |
  // ------------

  /**
   * Handler for the 'Delete course' -button.
   * @returns {Promise<void>}
   */
  const handleDeletion = async () => {
    const variables = { id };
    try {
      await deleteCourse({
        variables,
      });
    } catch (deletionError) {
      // eslint-disable-next-line no-console
      console.log('error:', deletionError);
    }
    history.push('/courses');
  };

  /**
   * Handles the exit from the manage groups -subpage. Makes sure that anything doesn't get discarded accidentally.
   * Takes a subpage in string format as a parameter.
   * @param subpage
   */
  const handleExitFromGroupsView = subpage => {
    if (
      !groupsUnsaved ||
      (groupsUnsaved &&
        // eslint-disable-next-line no-alert
        window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' })))
    ) {
      setGroupsUnsaved(false);
      history.push(`/course/${course.id}/${subpage}`);
    }
  };

  /**
   * Handler for the 'Edit course' -button.
   */
  const handleEditCourse = () => {
    if (match.params.subpage !== 'edit') {
      history.push(`/course/${course.id}/edit`);
    } else if (match.params.subpage === 'groups') {
      handleExitFromGroupsView('edit');
    } else {
      // Toggle functionality for the button. Used in CourseForm's cancel-button.
      history.push(`/course/${course.id}`);
    }
  };

  /**
   * Handler for switching the subpage to the manage groups -view.
   */
  const handleGroupsView = () => {
    if (match.params.subpage !== 'groups') {
      history.push(`/course/${course.id}/groups`);
    }
  };

  /**
   * Handler for switching the subpage to registrations view.
   */
  const handleRegistrationsView = () => {
    if (match.params.subpage !== 'registrations') {
      history.push(`/course/${course.id}/registrations`);
    } else if (match.params.subpage === 'groups') {
      handleExitFromGroupsView('registrations');
    }
  };

  /**
   * Handler for switching the subpage back to root (no subpage) within the tabs.
   */
  const handlePlainView = () => {
    if (match.params.subpage === 'groups') {
      handleExitFromGroupsView('');
    } else {
      history.push(`/course/${course.id}`);
    }
  };

  /**
   * Function to check if logged user is teacher or admin of this course.
   * @returns {boolean}
   */
  const userHasAccess = () => {
    const inTeachers = data.course.teachers.some(t => t.id === user.id);
    return user.role === roles.ADMIN_ROLE || inTeachers;
  };

  /**
   * Checks if the subpage value is undefined for MUI-Tabs to function correctly.
   * @returns {string}
   */
  const checkSubpageValue = () => {
    if (match.params.subpage === undefined || match.params.subpage === 'usergroup') {
      return 'root';
    }

    return match.params.subpage;
  };

  /**
   * Returns the register view as a Registration-component. Used in two sections of Course.js.
   * @returns {JSX.Element}
   */
  const renderRegistrationForm = () => {
    return (
      <div>
        <Registration course={course} match={match} />
      </div>
    );
  };

  return (
    <CourseContext.Provider value={{ deleteRegistration }}>
      <div>
        {/* Course info, hide in edit and questions views */}
        {match.params.subpage !== 'edit' && view !== 'questions' && (
          <div>
            {userHasAccess() ? (
              <div style={{ maxWidth: '800px' }}>
                {/* Only admin can edit or delete after publish */}
                {!course.published || user.role === roles.ADMIN_ROLE ? (
                  <>
                    <BlueButton onClick={handleEditCourse} data-cy="edit-course-button">
                      <FormattedMessage id="course.switchEditView" />
                    </BlueButton>
                    <ConfirmationButton
                      onConfirm={handleDeletion}
                      color={red[500]}
                      modalMessage={intl.formatMessage({ id: 'course.confirmDelete' })}
                      buttonDataCy="delete-course-button"
                    >
                      <FormattedMessage id="course.delete" />
                    </ConfirmationButton>
                  </>
                ) : null}
              </div>
            ) : null}
            <CourseInfo
              code={course.code}
              title={course.title}
              id={course.id}
              deadline={course.deadline}
              teachers={course.teachers}
              paragraphs={paragraphs}
            />
          </div>
        )}

        {/* Staff and admin control buttons */}
        <div>
          {userHasAccess() ? (
            <div>
              {(!course.published || user.role === roles.ADMIN_ROLE) &&
              match.params.subpage === 'edit' ? (
                <CourseForm
                  course={course}
                  user={user}
                  onCancelEdit={handleEditCourse}
                  editView={editView}
                />
              ) : (
                <div>
                  {/* Group management and enroll list available regardless of publish status */}
                  <div className={courseClass.root}>
                    <TabContext value={checkSubpageValue()}>
                      <AppBar position="static">
                        <TabList>
                          <Tab
                            label={intl.formatMessage({ id: 'course.switchRegisterView' })}
                            value="root"
                            onClick={handlePlainView}
                            data-cy="show-register-button"
                          />
                          <Tab
                            label={intl.formatMessage({ id: 'course.switchGroupsView' })}
                            value="groups"
                            onClick={handleGroupsView}
                            data-cy="manage-groups-button"
                          />
                          <Tab
                            label={intl.formatMessage({ id: 'course.switchRegistrationsView' })}
                            value="registrations"
                            onClick={handleRegistrationsView}
                            data-cy="show-registrations-button"
                          />
                        </TabList>
                      </AppBar>
                      {/* Register form / main view */}
                      <TabPanel value="root">{renderRegistrationForm()}</TabPanel>
                      {/* Views for staff */}
                      <TabPanel value="groups">
                        <div>
                          <GroupsView
                            course={course}
                            registrations={registrations}
                            regByStudentId={regByStudentId}
                            groups={groups}
                            setGroups={setGroups}
                          />
                          <br />
                          <BlueButton
                            onClick={handleGroupsView}
                            color="blue"
                            data-cy="back-to-info-from-groups-button"
                          >
                            <FormattedMessage id="course.switchInfoView" />
                          </BlueButton>
                        </div>
                      </TabPanel>
                      <TabPanel value="registrations">
                        <div>
                          <RegistrationList
                            course={course}
                            registrations={registrations}
                            regByStudentId={regByStudentId}
                          />
                          <br />
                          <BlueButton
                            onClick={handleRegistrationsView}
                            color="blue"
                            data-cy="back-to-info-from-groups-button"
                          >
                            <FormattedMessage id="course.switchInfoView" />
                          </BlueButton>
                        </div>
                      </TabPanel>
                    </TabContext>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* View for all */
            renderRegistrationForm()
          )}
        </div>
      </div>
    </CourseContext.Provider>
  );
};
