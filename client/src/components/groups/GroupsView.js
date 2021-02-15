import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GENERATE_GROUPS, SAVE_GROUPS, COURSE_GROUPS, PUBLISH_COURSE_GROUPS } from '../../GqlQueries';
import Groups from './Groups';
import userRoles from '../../util/userRoles';
import ConfirmationButton from '../ui/ConfirmationButton';
import SuccessMessage from '../ui/SuccessMessage';
import { Prompt } from 'react-router-dom';
import _ from 'lodash';

export default ({ course, registrations, regByStudentId }) => {
  const [generateGroups, { loading: generateGroupsLoading }] = useMutation(GENERATE_GROUPS);
  const [saveGeneratedGroups] = useMutation(SAVE_GROUPS);
  const [publishCourseGroups] = useMutation(PUBLISH_COURSE_GROUPS);

  const [groups, setGroups] = useStore('groupsStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [user] = useStore('userStore');
  const [grouplessStudents, setGroupless] = useStore('grouplessStore');

  const [oldGroups, setOldGroups] = useState([]);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [savedSuccessMsgVisible, setSavedSuccessMsgVisible] = useState(false);
  const [groupsPublished, setGroupsPublished] = useState(false);
  const [groupMessages, setGroupMessages] = useState(['']);
  const [groupNames, setGroupNames] = useState(['']);
  const [groupSorting, setGroupSorting] = useState('nameAscending');
  const [registrationsWithoutGroups, setregistrationsWithoutGroups] = useState(true)

  const intl = useIntl();

  const { loading, error, data, refetch } = useQuery(COURSE_GROUPS, {
    skip: user.role === userRoles.STUDENT_ROLE,
    variables: { courseId: course.id },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setGroupsPublished(course.groupsPublished);
  }, [course]);

  /* groupless students update
  useEffect(() => {
    let grouplessStudents = [];
    for each group
      check if student is in any group
      if not, add student to grouplessStudents
    setGroupless(grouplessStudents);
  }, [registrationsWithoutGroups])
  */

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
      handleGroupsMessagesAndNames(sortGroups(fetchedGroups, groupSorting));
      setOldGroups(fetchedGroups);
      setGroupsUnsaved(false);
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

  const sortGroups = (groups, sorting) => {
    const sortedGroups = _.cloneDeep(groups);
    if (sorting === 'nameAscending' || sorting === 'nameDescending') {
      sortedGroups.sort((a,b) => {
        let x = a.groupName.toLowerCase();
        let y = b.groupName.toLowerCase();
        let comp = x.localeCompare(y, undefined, {numeric: true, sensitivity: 'base'});
        return sorting === 'nameAscending' ? comp : -comp;
      });
    } else if (sorting === 'sizeAscending') {
      sortedGroups.sort((a,b) => a.students.length - b.students.length);
    } else if (sorting === 'sizeDescending') {
      sortedGroups.sort((a,b) => b.students.length - a.students.length);
    }
    return sortedGroups;
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
    const variables = { data: { courseId: course.id, minGroupSize: minGroupS} };
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
        handleGroupsMessagesAndNames(sortGroups(mappedGroups, groupSorting));
        setGroupsUnsaved(true);
        setGroups(mappedGroups)
      } catch (groupError) {
        console.log('error:', groupError);
      }
  };

  const saveSampleGroups = async () => {
    // Known bug while saving groups: The current user that does the saving,
    // does not get their own (if they are enrolled to a course & assigned to a group)
    // published group view updated without a refresh
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

  const handleSortGroups = (value) => {
    // Sorting currently does not preserve saved group names & messages correctly, so warn about reload
    if (groupsUnsaved
        && !window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))) {
      return;
    }
    setGroupSorting(value);
    handleGroupsMessagesAndNames(sortGroups(groups, value));
    setGroupsUnsaved(false);
  }
  
  /*
  const handleShowingGrouplessStudents = () => {

  }
  */

  const sortOptions = [
    {
      key: 'By name, ascending',
      text: 'By name, ascending',
      value: 'nameAscending'
    },
    {
      key: 'By name, descending',
      text: 'By name, descending',
      value: 'nameDescending'
    },
    {
      key: 'By size, ascending',
      text: 'By size, ascending',
      value: 'sizeAscending'
    },
    {
      key: 'By size, descending',
      text: 'By size, descending',
      value: 'sizeDescending'
    },
  ]

  if (loading || !groups) {
    return <Loader active />;
  }

  if (generateGroupsLoading) {
    return <Loader active content="Generating groups" />;
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
              <Form.Field>
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
              </Form.Field>
              <Form.Field>
              <Form.Select
                label={
                  <h4>
                    <FormattedMessage id="groupsView.groupListingOrder" />
                  </h4>
                }
                placeholder='Sort groups...'
                options={sortOptions}
                defaultValue={groupSorting}
                onChange={(e, {value}) => handleSortGroups(value)}
              />
              </Form.Field>
            </Form.Group>
            <ConfirmationButton
              onConfirm={handleSampleGroupCreation}
              modalMessage={ intl.formatMessage({ id: 'groupsView.confirmGroupGeneration' }) }
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

            {registrationsWithoutGroups && 
              <Button
                //onClick={showStudentsWithoutGroups}
                //buttonDataCy="show-groupless-button"
                color='grey'
              >
                <FormattedMessage id='groupsView.showGrouplessStudents' />
            </Button>}

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
