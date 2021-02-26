import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import roles from '../../util/userRoles';
import userRoles from '../../util/userRoles';
import { COURSE_BY_ID, DELETE_COURSE, COURSE_REGISTRATION, COURSE_GROUPS } from '../../GqlQueries';
import GroupsView from '../groups/GroupsView';
import CourseForm from './CourseForm';
import RegistrationList from '../registrations/RegistrationList';
import Registration from '../registrations/Registration';
import ConfirmationButton from '../ui/ConfirmationButton';
import CourseInfo from './CourseInfo';

export default ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [groups, setGroups] = useStore('groupsStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');

  const [course, setCourse] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [regByStudentId, setRegByStudentId] = useState([]);
  const [view, setView] = useState('info');

  const [deleteCourse] = useMutation(DELETE_COURSE);

  const history = useHistory();
  const intl = useIntl();

  // course description
  const paragraphs = course.description ? course.description.split('\n\n') : [];

  // GRAPHQL

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData, refetch: refetchRegistrations } = useQuery(COURSE_REGISTRATION, {
    skip: course.teachers === undefined
      || (!course.teachers.some(t => t.id === user.id) && user.role !== roles.ADMIN_ROLE),
    variables: { courseId: id },
  });

  const { loading: groupLoading,  data: groupData} = useQuery(COURSE_GROUPS, {
    skip: user.role === userRoles.STUDENT_ROLE,
    variables: { courseId: course.id },
  });

  // USEEFFECT

  useEffect(() => {
    if (!loading && data !== undefined) {
      setCourse({
        ...data.course,
        questions: data.course.questions.sort((a, b) => a.order - b.order),
      });
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

    if (!groupLoading && groupData !== undefined) {
      const fetchedGroups = groupData.courseGroups.map(e => {
        return {
          groupId: e.id,
          students: e.students,
          groupMessage: e.groupMessage,
          groupName: e.groupName
        }
      });
    }

  }, [data, loading, regData, regLoading, groupLoading, groupData]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>Error loading course. Course might have been removed or it is not published yet.</div>
    );
  }

  if (loading || !course) {
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
      console.log('error:', deletionError);
    }
    history.push('/courses');
  };

  const handleEditCourse = () => {
    if (view !== 'edit') {
      setView('edit');
    } else if (view === 'groups') {
      if (groupsUnsaved
        && window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))) {
        setView('edit');
        setGroupsUnsaved(false);
      } else if (!groupsUnsaved) {
        setView('edit');
      }
    } else {
      setView('info');
    }
  };

  const handleGroupsView = () => {
    if (view !== 'groups') {
      setView('groups');
    } else {
      if (!groupsUnsaved || (groupsUnsaved
        && window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' })))) {
        setGroupsUnsaved(false);
        setView('info');
      }
    }
  };

  const handleRegistrationsView = () => {
    if (view !== 'registrations') {
      setView('registrations');
    } else {
      setView('info');
    }
  };

  // function to check if logged in user is teacher of this course or admin
  const userHasAccess = () => {
    const inTeachers = data.course.teachers.some(t => t.id === user.id);
    if (user.role === roles.ADMIN_ROLE || inTeachers) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      {/* Course info, hide in edit and questions views */}
      <h2><a href={`https://courses.helsinki.fi/fi/${course.code}`}>{course.code}</a>{` - ${course.title}`}</h2>
      { view !== 'edit' && view !== 'questions' && <div>
        <CourseInfo id={course.id} deadline={course.deadline} teachers={course.teachers} paragraphs={paragraphs} />
				 &nbsp;
      </div>}

      {/* Staff and admin control buttons */}
      <div>
        {userHasAccess() ? (
          <div>
            { view === 'edit' ? (
              <CourseForm
                course={course}
                user={user}
                onCancelEdit={handleEditCourse}
                editView={true}
              />
            ) : (
                <div>
                  <div style={{ maxWidth: '800px' }}>
                    <Button.Group widths='4'>
                      {/* Only admin can edit or delete after publish */}
                      {(!course.published || user.role === roles.ADMIN_ROLE) && view === 'info' ? (
                        <>

                          <Button onClick={handleEditCourse} color="blue" data-cy="edit-course-button">
                            <FormattedMessage id="course.switchEditView" />
                          </Button>
                          <ConfirmationButton
                            onConfirm={handleDeletion}
                            modalMessage={intl.formatMessage({ id: "course.confirmDelete" })}
                            buttonDataCy="delete-course-button"
                            color="red"
                          >
                            <FormattedMessage id="course.delete" />
                          </ConfirmationButton>

                        </>
                      ) : null}
                      {/* Group management and enroll list available regardless of publish status */}
                      <>
                        {view === 'info' ?
                          <>

                            <Button onClick={handleGroupsView} color="green" data-cy="manage-groups-button">
                              <FormattedMessage id="course.switchGroupsView" />
                            </Button>
                            <Button onClick={handleRegistrationsView} color="orange" data-cy="show-registrations-button">
                              <FormattedMessage id="course.switchRegistrationsView" />
                            </Button>

                          </>
                          : null}
                      </>
                    </Button.Group>
                  </div>

                  {/* Views for staff */}
                  <div>
                    {view === 'groups' ? (
                      <div>
                        <GroupsView
                          course={course}
                          registrations={registrations}
                          regByStudentId={regByStudentId}
                          groups={groups}
                          setGroups={setGroups}
                        />
                        <br></br>
                        <Button onClick={handleGroupsView} color="blue" data-cy="back-to-info-from-groups-button">
                          <FormattedMessage id="course.switchInfoView" />
                        </Button>
                      </div>
                    ) : (
                        <div>
                          {view === 'registrations' ?
                            <div>
                              <RegistrationList
                                course={course}
                                registrations={registrations}
                                refetchRegistrations={refetchRegistrations}
                                regByStudentId={regByStudentId}
                              />
                              <br></br>
                              <Button onClick={handleRegistrationsView} color="blue" data-cy="back-to-info-from-groups-button">
                                <FormattedMessage id="course.switchInfoView" />
                              </Button>
                            </div>
                            : null}
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
          {view === 'info' ?
            <Registration course={course} />
            : null}
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
