import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GENERATE_GROUPS, EDIT_MIN_MAX_COURSE, COURSE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';
import userRoles from '../../util/user_roles';

export default ({ courseId, registrations }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [editMinMax] = useMutation(EDIT_MIN_MAX_COURSE);
  const [matchingTimes, setMatchingTimes] = useState(0);
  const [minGroupSize, setMinGroupSize] = useState(0);
  const [maxGroupSize, setMaxGroupSize] = useState(0);
  const [groups, setGroups] = useState([]);
  const [user] = useStore('userStore');

  const intl = useIntl();

  const { loading, error, data } = useQuery(COURSE_GROUPS, {
    skip: user.role !== userRoles.ADMIN_ROLE,
    variables: { courseId },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      setGroups(data.courseGroups.map(e => e.students));
    }
  }, [data, loading]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const editCourseMinMax = async () => {
    const variables = { id: courseId, min: minGroupSize, max: maxGroupSize };
    try {
      await editMinMax({
        variables,
      });
    } catch (courseError) {
      console.log('error:', courseError);
    }
  };

  const handleGroupCreation = async () => {
    const variables = { data: { courseId } };
    if (window.confirm(intl.formatMessage({ id: 'groupsView.confirmGroupGenration' }))) {
      editCourseMinMax();
      try {
        const res = await generateGroups({
          variables,
        });
        console.log('res:', res);
        setGroups(res.data.createGroups.map(groupObject => groupObject.students));
      } catch (groupError) {
        console.log('error:', groupError);
      }
    }
  };

  if (loading || !groups) {
    return <Loader active />;
  }

  return (
    <div>
      {registrations.length === 0 ? (
        <div>
          <h3>
            <FormattedMessage id="groupsView.noRegistrations" />
          </h3>
        </div>
      ) : (
        <div>
          <Form onSubmit={handleGroupCreation}>
            <Form.Group>
              <Form.Input
                required
                type="number"
                min="1"
                max="9999999"
                label={
                  <h4>
                    <FormattedMessage id="groupsView.minGroupSize" />
                  </h4>
                }
                onChange={event => setMinGroupSize(Number.parseInt(event.target.value, 10))}
              />
              <Form.Input
                required
                type="number"
                min="1"
                max="9999999"
                label={
                  <h4>
                    <FormattedMessage id="groupsView.maxGroupSize" />
                  </h4>
                }
                onChange={event => setMaxGroupSize(Number.parseInt(event.target.value, 10))}
              />
              <Form.Input
                required
                type="number"
                min="1"
                max="9999999"
                label={
                  <h4>
                    <FormattedMessage id="groupsView.matchingTimes" />
                  </h4>
                }
                onChange={event => setMatchingTimes(Number.parseInt(event.target.value, 10))}
              />
            </Form.Group>
            <Form.Button color="orange">
              <FormattedMessage id="course.generateGroups" />
            </Form.Button>
          </Form>
          <p />

          <Groups courseId={courseId} groups={groups} setGroups={setGroups} />
        </div>
      )}
    </div>
  );
};
