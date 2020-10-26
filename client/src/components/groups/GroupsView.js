import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GENERATE_GROUPS, COURSE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';
import userRoles from '../../util/userRoles';
import ConfirmationButton from '../ui/ConfirmationButton';

export default ({ course, registrations, regByStudentId }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [groups, setGroups] = useStore('groupsStore');
  const [user] = useStore('userStore');

  const intl = useIntl();

  const { loading, error, data, refetch } = useQuery(COURSE_GROUPS, {
    skip: user.role !== userRoles.ADMIN_ROLE,
    variables: { courseId: course.id },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      const fetchedGroups = data.courseGroups.map(e => e.students);
      setGroups(fetchedGroups);
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

  const handleGroupCreation = async () => {
    const minGroupS = minGroupSize ? minGroupSize : 1;
    const variables = { data: { courseId: course.id, minGroupSize: minGroupS } };
      try {
        await generateGroups({
          variables,
        });
        refetch();
      } catch (groupError) {
        console.log('error:', groupError);
      }
  };

  if (loading || !groups) {
    return <Loader active />;
  }

  return (
    <div>
      &nbsp;
      {registrations.length === 0 ? (
        <div>
          <h3>
            <FormattedMessage id="groupsView.noRegistrations" />
          </h3>
        </div>
      ) : (
        <div>
          <Form>
            <Form.Group>
              <Form.Input
                required
                value={minGroupSize}
                type="number"
                min="1"
                max="9999999"
                label={
                  <h4>
                    <FormattedMessage id="groupsView.targetGroupSize" />
                  </h4>
                }
                onChange={event => setMinGroupSize(Number.parseInt(event.target.value, 10) 
                  ? Number.parseInt(event.target.value, 10)
                  : 1)}
              />
            </Form.Group>
            <ConfirmationButton 
              onConfirm={handleGroupCreation}
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmGroupGenration' }) }
              buttonDataCy="create-groups-submit"
              color="orange"
            >
              <FormattedMessage id="course.generateGroups" />
            </ConfirmationButton>
          </Form>
          <p />

          <Groups course={course} regByStudentId={regByStudentId} />
        </div>
      )}
    </div>
  );
};
