import React, { useState, useEffect, useReducer, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import { Loader } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  COURSE_BY_ID,
  DELETE_COURSE,
  COURSE_REGISTRATION,
  DELETE_REGISTRATION
} from '../../GqlQueries';

import { GreenButton, BlueButton, OrangeButton } from '../../styles/ui/Button'
import { red } from '@material-ui/core/colors';

import RegistrationList from '../registrations/RegistrationList';
import ConfirmationButton from '../ui/ConfirmationButton';
import Registration from '../registrations/Registration';
import GroupsView from '../groups/GroupsView';
import CourseForm from './CourseForm';
import CourseInfo from './CourseInfo';
import roles from '../../util/userRoles';
import { AppContext } from '../../App';
import { Typography } from '@material-ui/core';

/*
const useEffectWithOldDeps = (effect, deps) => {
  const [oldDeps, setOldDeps] = useState(deps);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('EFFECT ', deps, oldDeps);
    const cleanup = effect(oldDeps);
    setOldDeps(deps);
    return () => cleanup();
  }, deps); // eslint-disable-line
};
 */

export default ({ id, match }) => {
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [regByStudentId, setRegByStudentId] = useState([]);
  const [courses, setCourses] = useStore('coursesStore');
  const [groups, setGroups] = useStore('groupsStore');
  const [editView, setEditView] = useState(false);
  const [course, setCourse] = useState({});
  const [view] = useState('info');
  const history = useHistory();
  const intl = useIntl();
  const { user } = useContext(AppContext);

  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);

  const [courseState, courseDispatch] = useReducer(
    (state, action) => {
      // eslint-disable-next-line no-console
      //console.log(state, action);
      switch (action.type) {
        case 'delete_registration':
          return {
            ...state,
            registrations: state.registrations.filter(
              ({ student: { id } }) => id !== action.payload
            ),
          };
        case 'set_registrations':
          return {
            ...state,
            registrations: action.payload,
          };
        default:
          throw new Error(`Invalid action: ${action.type}`);
      }
    },
    {
      registrations: [],
    }
  );

  const { registrations } = courseState;
  const setRegistrations = regs => courseDispatch({ type: 'set_registrations', payload: regs });

  const [deleteCourse] = useMutation(DELETE_COURSE);

  const [oldCourseState, setOldCourseState] = useState(courseState);

  useEffect(() => {
    (async () => {
      if (oldCourseState.registrations.length > courseState.registrations.length) {
        const deleted = oldCourseState.registrations.reduce(
          (deleted, oldReg) =>
            courseState.registrations.includes(oldReg) ? deleted : deleted.concat(oldReg),
          []
        );

        await Promise.all(
          deleted.map(deletedReg =>
            deleteRegistration({
              variables: { courseId: course.id, studentId: deletedReg.student.id },
            })
          )
        );

        if (deleted.some(deletedReg => deletedReg.student.id === user.id)) {
          history.push('/courses');
        }
      }
    })();
    return setOldCourseState(courseState);
  }, [courseState.registrations]); // eslint-disable-line

  // Course description
  const paragraphs = course.description ? course.description.split('\n\n') : [];

  // GRAPHQL

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
    skip:
      course.teachers === undefined ||
      (!course.teachers.some(t => t.id === user.id) && user.role !== roles.ADMIN_ROLE),
    variables: { courseId: id },
  });

  // useEFFECT

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: data.course.questions.sort((a, b) => a.order - b.order),
      });
      // only show editView if course is loaded, used for routing:
      setEditView(true);
    }

    if (!regLoading && regData !== undefined) {
      const reg = regData.courseRegistrations.map(r => {
        r.questionAnswers.sort((a, b) => a.question.order - b.question.order);
        r.questionAnswers.forEach(qa => qa.answerChoices.sort((a, b) => a.order - b.order));
        return r;
      });
      setRegistrations(reg);
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

  if (loading || !course.id || regLoading || !registrations) {
    return <Loader active />;
  }

  // HANDLERS

  const handleDeletion = async () => {
    const variables = { id };
    try {
      await deleteCourse({
        variables,
      });
      const trimmedCourses = [];

      courses.forEach(remainingCourse => {
        if (remainingCourse.id !== id) {
          trimmedCourses.push(remainingCourse);
        }
      });
      setCourses(trimmedCourses);
    } catch (deletionError) {
      // eslint-disable-next-line no-console
      console.log('error:', deletionError);
    }
    history.push('/courses');
  };

  const handleEditCourse = () => {
    if (match.params.subpage !== 'edit') {
      history.push(`/course/${course.id}/edit`);
    } else if (match.params.subpage === 'groups') {
      if (
        groupsUnsaved &&
        // eslint-disable-next-line no-alert
        window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))
      ) {
        setGroupsUnsaved(false);
        history.push(`/course/${course.id}/edit`);
      } else if (!groupsUnsaved) {
        history.push(`/course/${course.id}/edit`);
      }
    } else {
      history.push(`/course/${course.id}`);
    }
  };

  const handleGroupsView = () => {
    if (match.params.subpage !== 'groups') {
      history.push(`/course/${course.id}/groups`);
    } else if (
      !groupsUnsaved ||
      (groupsUnsaved &&
        // eslint-disable-next-line no-alert
        window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' })))
    ) {
      setGroupsUnsaved(false);
      history.push(`/course/${course.id}`);
    }
  };

  const handleRegistrationsView = () => {
    if (match.params.subpage !== 'registrations') {
      history.push(`/course/${course.id}/registrations`);
    } else {
      history.push(`/course/${course.id}`);
    }
  };

  // function to check if logged in user is teacher of this course or admin
  const userHasAccess = () => {
    const inTeachers = data.course.teachers.some(t => t.id === user.id);
    return user.role === roles.ADMIN_ROLE || inTeachers;
  };


  return (
    <div>
      {/* Course info, hide in edit and questions views */}
      {match.params.subpage !== 'edit' && view !== 'questions' && (
        <div>
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
                <div style={{ maxWidth: '800px' }}>
                    {/* Only admin can edit or delete after publish */}
                    {!course.published || user.role === roles.ADMIN_ROLE ? (
                      <>
                        <BlueButton
                          onClick={handleEditCourse}
                          data-cy="edit-course-button"
                        >
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
                    {/* Group management and enroll list available regardless of publish status */}
                    <OrangeButton onClick={handleRegistrationsView} data-cy="show-registrations-button">
                      <FormattedMessage id="course.switchRegistrationsView" />
                    </OrangeButton>
                    <GreenButton onClick={handleGroupsView} data-cy="manage-groups-button">
                      <FormattedMessage id="course.switchGroupsView" />
                    </GreenButton>
                </div>

                {/* Views for staff */}
                <div>
                  {match.params.subpage === 'groups' ? (
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
                  ) : (
                    <div>
                      {match.params.subpage === 'registrations' ? (
                        <div>
                          <RegistrationList
                            courseReducer={[courseState, courseDispatch]}
                            course={course}
                            registrations={registrations}
                            setRegistrations={setRegistrations}
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
                      ) : null}
                    </div>
                  )}
                  &nbsp;
                </div>
              </div>
            )}
          </div>
        ) : null}
        {/* Views for everyone */}
        <div>
          {match.params.subpage === undefined || match.params.subpage === 'usergroup' ? (
            <Registration
              courseReducer={[courseState, courseDispatch]}
              course={course}
              match={match}
            />
          ) : null}
        </div>
        &nbsp;
        {/*
				<div>
					{ view === 'userGroup' ? (
						<div>
							<UserGroup user={user} course={course} />
						</div>
					) : null}
				</div>
			  */}
      </div>
    </div>
  );
};
