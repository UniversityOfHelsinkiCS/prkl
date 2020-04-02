import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { GENERATE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';

export default ({ courseId, registrations }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [matchingTimes, setMatchingTimes] = useState(0);

  const handleGroupCreation = async () => {
    const variables = { data: { courseId } };
    if (window.confirm('Are you sure you want to generate groups?') && matchingTimes !== 0) {
      try {
        await generateGroups({
          variables,
        });
        window.location.reload();
      } catch (groupError) {
        console.log('error:', groupError);
      }
    }
  };
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
          <Form>
            <Form.Group>
              <Form.Input
                required
                type="number"
                min="1"
                max="9999999"
                label={(
                  <h4>
                    <FormattedMessage id="groupsView.matchingTimes" />
                  </h4>
                )}
                onChange={event => setMatchingTimes(Number.parseInt(event.target.value, 10))}
              />
            </Form.Group>
            <Form.Button onClick={handleGroupCreation} color="orange">
              <FormattedMessage id="course.generateGroups" />
            </Form.Button>
          </Form>
          <p />

          <Groups courseId={courseId} />
        </div>
      )}
    </div>
  );
};
