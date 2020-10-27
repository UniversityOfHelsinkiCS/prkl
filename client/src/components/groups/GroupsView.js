import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GENERATE_GROUPS, SAVE_GROUPS, COURSE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';
import userRoles from '../../util/userRoles';
import ConfirmationButton from '../ui/ConfirmationButton';
import SuccessMessage from '../ui/SuccessMessage';

export default ({ course, registrations, regByStudentId }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [saveGeneratedGroups] = useMutation(SAVE_GROUPS);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [groupsUnsaved, setGroupsUnsaved] = useState(false);
  const [savedSuccessMsgVisible, setSavedSuccessMsgVisible] = useState(false);
  const [groups, setGroups] = useStore('groupsStore');
  const [user] = useStore('userStore');

  const intl = useIntl();

  const { loading, error, data } = useQuery(COURSE_GROUPS, {
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

  const handleSampleGroupCreation = async () => {
    const minGroupS = minGroupSize ? minGroupSize : 1;
    const variables = { data: { courseId: course.id, minGroupSize: minGroupS } };
      try {
        const res = await generateGroups({
          variables,
        });
        const mappedGroups = res.data.createSampleGroups.map(e => e.students);
        setGroups(mappedGroups);
        setGroupsUnsaved(true);
      } catch (groupError) {
        console.log('error:', groupError);
      }
  };

  const saveSampleGroups = async () => {
    if (!groups || groups.length === 0) return;
    try {
      const userIdGroups = groups.map(g => {
        return {userIds: g.map(student => student.id)};
      });
      const variables = {data: { courseId: course.id, groups: userIdGroups }};
      await saveGeneratedGroups({ variables });
      setGroupsUnsaved(false);
      setSavedSuccessMsgVisible(true);
      setTimeout(() => {
        setSavedSuccessMsgVisible(false);
      }, 3000);
    } catch (groupError) {
      console.log('error:', groupError);
    }
  }

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
              onConfirm={handleSampleGroupCreation}
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmGroupGenration' }) }
              buttonDataCy="create-groups-submit"
              color="orange"
            >
              <FormattedMessage id="groupsView.generateGroups" />
            </ConfirmationButton>
            {groupsUnsaved && <ConfirmationButton
              onConfirm={saveSampleGroups}
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmGroupsSave' }) }
              buttonDataCy="save-groups-button"
            >
              <FormattedMessage id='groupsView.saveGroups' />
            </ConfirmationButton>}
          </Form>
          <p />

          {groupsUnsaved && <SuccessMessage iconVar='info'>{intl.formatMessage({ id: 'groupsView.unsavedGroupsInfo' })}</SuccessMessage>}
            {savedSuccessMsgVisible && <SuccessMessage>{intl.formatMessage({ id: 'groupsView.groupsSavedSuccessMsg' })}</SuccessMessage>}
          <Groups course={course} regByStudentId={regByStudentId} />

        </div>
      )}
    </div>
  );
};
