import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import roles from '../../util/user_roles';
import { COURSE_BY_ID, DELETE_COURSE, COURSE_REGISTRATION } from '../../GqlQueries';
import GroupsView from './GroupsView';
import EditView from './EditView';
import RegistrationList from './RegistrationList';
import Registration from '../registration/Registration';

export default ({ id }) => {
  const [courses, setCourses] = useStore('coursesStore');
  const [user] = useStore('userStore');
  const [course, setCourse] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [regByStudentId, setRegByStudentId] = useState([]);
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const [view, setView] = useState('registrations');
  const history = useHistory();

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id },
  });

  const { loading: regLoading, data: regData } = useQuery(COURSE_REGISTRATION, {
    skip: user.role === roles.STUDENT_ROLE,
    variables: { courseId: id },
  });

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
  }, [data, loading, regData, regLoading]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>Error loading course. Course might have been removed or it is not published yet.</div>
    );
  }

  if (loading || !course) {
    return <Loader active />;
  }

  const handleDeletion = async () => {
    const variables = { id };
    if (window.confirm('Delete course?')) {
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
    }
  };

  const handleEditCourse = () => {
    if (view === 'registrations') {
      setView('edit');
    } else {
      setView('registrations');
    }
  };

  const handleGroupsView = () => {
    if (view === 'registrations') {
      setView('groups');
    } else {
      setView('registrations');
    }
  };

  return (
    <div>
      <h2>{`${course.code} - ${course.title}`}</h2>
      {user && user.role >= roles.STAFF_ROLE ? (
        <div>
          {view === 'registrations' ? (
            <div>
              <p>
                <Button onClick={handleGroupsView} color="blue">
                  <FormattedMessage id="course.switchGroupsView" />
                </Button>
              </p>
              {(user.role === roles.ADMIN_ROLE ||
                (user.role === roles.STAFF_ROLE && !course.published && user.id === data.course.teacher.id)) && (
                <p>
                  <Button onClick={handleDeletion} color="red" data-cy="delete-course-button">
                    <FormattedMessage id="course.delete" />
                  </Button>
                </p>
              )}
              {(user.role === roles.ADMIN_ROLE ||
                (user.role === roles.STAFF_ROLE && !course.published)) && (
                <p>
                  <Button onClick={handleEditCourse} color="blue" data-cy="edit-course-button">
                    <FormattedMessage id="course.switchEditView" />
                  </Button>
                </p>
              )}
            </div>
          ) : (
            <Button onClick={handleGroupsView} color="blue">
              <FormattedMessage id="course.switchCourseView" />
            </Button>
          )}
        </div>
      ) : null}
      {view === 'groups' ? (
        <GroupsView course={course} registrations={registrations} regByStudentId={regByStudentId} />
      ) : view === 'registrations' ? (
        <RegistrationList
          course={course}
          registrations={registrations}
          user={user}
        />
      ) : (
        <EditView course={course} />
      )}
      <Registration course={course} />
    </div>
  );
};
