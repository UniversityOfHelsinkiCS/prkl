import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { GENERATE_GROUPS, EDIT_MIN_MAX_COURSE } from '../../GqlQueries';
import Groups from './Groups';

export default ({ courseId, registrations }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [editMinMax] = useMutation(EDIT_MIN_MAX_COURSE);
  const [matchingTimes, setMatchingTimes] = useState(0);
  const [minGroupSize, setMinGroupSize] = useState(0);
  const [maxGroupSize, setMaxGroupSize] = useState(0);

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
    if (
      window.confirm('Are you sure you want to generate groups?') &&
      matchingTimes !== 0 &&
      minGroupSize !== 0 &&
      maxGroupSize !== 0
    ) {
      editCourseMinMax();
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
                    <FormattedMessage id="groupsView.minGroupSize" />
                  </h4>
                )}
                onChange={event => setMinGroupSize(Number.parseInt(event.target.value, 10))}
              />
              <Form.Input
                required
                type="number"
                min="1"
                max="9999999"
                label={(
                  <h4>
                    <FormattedMessage id="groupsView.maxGroupSize" />
                  </h4>
                )}
                onChange={event => setMaxGroupSize(Number.parseInt(event.target.value, 10))}
              />
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
