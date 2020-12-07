import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GENERATE_GROUPS, SAVE_GROUPS, COURSE_GROUPS, PUBLISH_COURSE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';
import userRoles from '../../util/userRoles';
import ConfirmationButton from '../ui/ConfirmationButton';
import SuccessMessage from '../ui/SuccessMessage';
import { Prompt } from 'react-router-dom';

export default ({ course, registrations, regByStudentId }) => {
  const [generateGroups] = useMutation(GENERATE_GROUPS);
  const [saveGeneratedGroups] = useMutation(SAVE_GROUPS);
  const [publishCourseGroups] = useMutation(PUBLISH_COURSE_GROUPS);

  const [groups, setGroups] = useStore('groupsStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [user] = useStore('userStore');

  const [oldGroups, setOldGroups] = useState([]);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [savedSuccessMsgVisible, setSavedSuccessMsgVisible] = useState(false);
  const [groupsPublished, setGroupsPublished] = useState(false);
  const [groupMessages, setGroupMessages] = useState(['']);
  const [groupNames, setGroupNames] = useState(['']);

  const intl = useIntl();

  const { loading, error, data, refetch } = useQuery(COURSE_GROUPS, {
    skip: user.role === userRoles.STUDENT_ROLE,
    variables: { courseId: course.id },
  });

  useEffect(() => {
    setGroupsPublished(course.groupsPublished);
  }, [course]);

  useEffect(() => {
    if (!loading && data !== undefined) {
      const fetchedGroups = data.courseGroups.map(e => {
        return {
          groupId: e.id,
          students: e.students,
          groupMessage: e.groupMessage,
          groupName: e.groupName
        }
      });
      handleGroupsMessagesAndNames(fetchedGroups);
      setOldGroups(fetchedGroups);
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

  const handleGroupsMessagesAndNames = (groups) => {
    setGroups(groups);
    const groupNames = groups.map(g => g.groupName);
    const groupMsgs = groups.map(g => g.groupMessage);
    setGroupNames(groupNames);
    setGroupMessages(groupMsgs);
  }

  const handleSampleGroupCreation = async () => {
    const minGroupS = minGroupSize ? minGroupSize : 1;
    const variables = { data: { courseId: course.id, minGroupSize: minGroupS } };
      try {
        const res = await generateGroups({
          variables,
        });
        const mappedGroups = res.data.createSampleGroups.map((e,i) => {
          return {
            groupId: '',
            students: e.students,
            groupMessage: '',
            groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i+1}`
          }
        });
        handleGroupsMessagesAndNames(mappedGroups);
        setGroupsUnsaved(true);
      } catch (groupError) {
        console.log('error:', groupError);
      }
  };

  const saveSampleGroups = async () => {
    if (!groups || groups.length === 0) return;
    try {
      const userIdGroups = groups.map((g, i) => {
        return {
          id: g.groupId,
          userIds: g.students.map(student => student.id),
          groupMessage: groupMessages[i],
          groupName: groupNames[i]
        };
      });
      const variables = {data: { courseId: course.id, groups: userIdGroups }};
      await saveGeneratedGroups({ variables });
      setGroupsUnsaved(false);
      setSavedSuccessMsgVisible(true);
      refetch();
      setTimeout(() => {
        setSavedSuccessMsgVisible(false);
      }, 3000);
    } catch (groupError) {
      console.log('error:', groupError);
    }
  }

  const publishGroups = async () => {
    const id = course.id;
    const variables = { id };
    try {
      await publishCourseGroups({ variables });
      setGroupsPublished(true);
    }
    catch (error) {
      console.log(error);
    }
  }

  // cancel-button has some problems...
  const cancelGroups = () => {
    setGroups(oldGroups);
    setGroupsUnsaved(false);
    //console.log("old", oldGroups);
  }

  if (loading || !groups) {
    return <Loader active />;
  }

  return (
    <div>
      <Prompt
        when={groupsUnsaved}
        message={intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' })}
      />
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
                data-cy="target-group-size"
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
                  : '')}
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
            {groupsUnsaved &&
            <>
            <ConfirmationButton
              onConfirm={saveSampleGroups}
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmGroupsSave' }) }
              buttonDataCy="save-groups-button"
            >
              <FormattedMessage id='groupsView.saveGroups' />
            </ConfirmationButton>
            {<ConfirmationButton
              onConfirm={cancelGroups}
              color="red"
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmCancelGroups' })}
              buttonDataCy="cancel-groups-button"
            >
              <FormattedMessage id='groupsView.cancelGroups' />
            </ConfirmationButton>}
            </>}
            {!groupsPublished && <ConfirmationButton
              onConfirm={publishGroups}
              modalMessage={ intl.formatMessage({ id: 'groupsView.publishGroupsConfirm' }) }
              buttonDataCy="publish-groups-button"
              color='green'
            >
              <FormattedMessage id='groupsView.publishGroupsBtn' />
            </ConfirmationButton>}
          </Form>
          <p />

          {groupsPublished && 
          <SuccessMessage iconVar='info'>{
            intl.formatMessage({ id: 'groupsView.publishedGroupsInfo' })}
          </SuccessMessage>}

          {groupsUnsaved && 
          <SuccessMessage iconVar='info'>
            {intl.formatMessage({ id: 'groupsView.unsavedGroupsInfo' })}
          </SuccessMessage>}

          {savedSuccessMsgVisible && 
          <SuccessMessage>
            {intl.formatMessage({ id: 'groupsView.groupsSavedSuccessMsg' })}
          </SuccessMessage>}

          <Groups 
            course={course}
            regByStudentId={regByStudentId}
            groupNames={groupNames}
            setGroupNames={setGroupNames}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
          />
        </div>
      )}
    </div>
  );
};
