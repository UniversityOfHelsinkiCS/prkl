/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import { Prompt } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import { Alert } from '@material-ui/lab';
import _ from 'lodash';
import {
  GENERATE_GROUPS,
  SAVE_GROUPS,
  COURSE_GROUPS,
  PUBLISH_COURSE_GROUPS,
} from '../../GqlQueries';

import ConfirmationButton from '../ui/ConfirmationButton';
import GrouplessStudents from './GrouplessStudents';
import Groups from './Groups';

import userRoles from '../../util/userRoles';

export default ({ course, registrations, regByStudentId, groups, setGroups }) => {
  const [generateGroups, { loading: generateGroupsLoading }] = useMutation(GENERATE_GROUPS);

  const [saveGeneratedGroups] = useMutation(SAVE_GROUPS);
  const [publishCourseGroups] = useMutation(PUBLISH_COURSE_GROUPS);

  const [grouplessStudents, setGrouplessStudents] = useStore('grouplessStudentsStore');
  const [lockedGroupsStore, setLockedGroupsStore] = useStore('lockedGroupsStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [user] = useStore('userStore');
  const [notification, setNotification] = useStore('notificationStore');

  const [registrationsWithoutGroups, setRegistrationsWithoutGroups] = useState(true);
  const [groupSorting, setGroupSorting] = useState('nameAscending');
  const [groupsPublished, setGroupsPublished] = useState(false);
  const [groupMessages, setGroupMessages] = useState(['']);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [groupNames, setGroupNames] = useState(['']);
  const [oldGroups, setOldGroups] = useState([]);

  const intl = useIntl();

  const { loading, error, data, refetch } = useQuery(COURSE_GROUPS, {
    skip: user.role === userRoles.STUDENT_ROLE,
    variables: { courseId: course.id },
  });

  useEffect(() => {
    if (course.id !== undefined) {
      refetch();
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    setGroupsPublished(course.groupsPublished);
  }, [course]);

  const handleGroupsMessagesAndNames = groups => {
    setGroups(groups);
    const groupNames = groups.map(g => g.groupName);
    const groupMsgs = groups.map(g => g.groupMessage);
    setGroupNames(groupNames);
    setGroupMessages(groupMsgs);
  };

  const sortGroups = (groups, sorting) => {
    const sortedGroups = _.cloneDeep(groups);
    if (sorting === 'nameAscending' || sorting === 'nameDescending') {
      sortedGroups.sort((a, b) => {
        const x = a.groupName.toLowerCase();
        const y = b.groupName.toLowerCase();
        const comp = x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
        return sorting === 'nameAscending' ? comp : -comp;
      });
    } else if (sorting === 'sizeAscending') {
      sortedGroups.sort((a, b) => a.students.length - b.students.length);
    } else if (sorting === 'sizeDescending') {
      sortedGroups.sort((a, b) => b.students.length - a.students.length);
    }
    return sortedGroups;
  };

  useEffect(() => {
    if (!loading && data !== undefined) {
      const fetchedGroups = data.courseGroups.map(e => {
        return {
          groupId: e.id,
          students: e.students,
          groupMessage: e.groupMessage,
          groupName: e.groupName,
        };
      });
      handleGroupsMessagesAndNames(sortGroups(fetchedGroups, groupSorting));
      setOldGroups(fetchedGroups);
      setGroupsUnsaved(false);
    }
  }, [data, loading]); // eslint-disable-line

  useEffect(() => {
    const studentIds = [];
    const groupless = [];

    groups.forEach(g => {
      g.students.forEach(({ id }) => {
        if (id) {
          studentIds.push(id);
        }
      });
    });

    registrations.forEach(r => {
      if (!studentIds.includes(r.student.id)) groupless.push(r.student);
    });

    if (groupless.length > 0) {
      setRegistrationsWithoutGroups(true);
    } else {
      setRegistrationsWithoutGroups(false);
    }

    setGrouplessStudents(groupless);
  }, [registrationsWithoutGroups, groups]); // eslint-disable-line

  if (error !== undefined) {
    // eslint-disable-next-line no-console
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const handleGroupCreation = () => {
    if (lockedGroupsStore.length === 0) {
      handleSampleGroupCreation();
    } else {
      generateNewGroupsForNonLockedGroups();
    }
  }

  const handleSampleGroupCreation = async () => {
    const minGroupS = minGroupSize || 1;
    try {
      const res = await generateGroups({
        variables: {
          data: {
            courseId: course.id,
            targetGroupSize: minGroupS,
            registrationIds: registrations.map(reg => reg.id),
          },
        },
      });

      const mappedGroups = res.data.createSampleGroups.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });
      handleGroupsMessagesAndNames(sortGroups(mappedGroups, groupSorting));
      setGroupsUnsaved(true);
      setRegistrationsWithoutGroups(false);
      setGroups(mappedGroups);
    } catch (groupError) {
      // eslint-disable-next-line no-console
      console.log('error:', groupError);
    }
  };

  const generateNewGroupsForNonLockedGroups = async () => {
    const lockedGroups = lockedGroupsStore;

    const registrationIds = [];
    const lockedRegistrationIds = [];

    lockedGroups.map(group => {
      group.students.map(student => lockedRegistrationIds.push(student.id));
    });

    registrations.map(registration => {
      console.log(registration);
      if (!lockedRegistrationIds.includes(registration.student.id)) {
        registrationIds.push(registration.id);
      }
    })

    const minGroupS = minGroupSize || 1;

    try {
      const res = await generateGroups({
        variables: {
          data: {
            courseId: course.id,
            targetGroupSize: minGroupS,
            registrationIds: registrationIds
          },
        },
      });
      const mappedGroups = res.data.createSampleGroups.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });

      const resultGroups = sortGroups(lockedGroups.concat(mappedGroups), groupSorting);

      handleGroupsMessagesAndNames(resultGroups);
      setGroupsUnsaved(true);
      setRegistrationsWithoutGroups(false);
      setGroups(resultGroups);
      setLockedGroupsStore([]);
    } catch (groupError) {
      // eslint-disable-next-line no-console
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
          groupName: groupNames[i],
        };
      });
      const variables = { data: { courseId: course.id, groups: userIdGroups } };
      await saveGeneratedGroups({ variables });
      setGroupsUnsaved(false);
      await refetch();
      setNotification({
        type: 'success',
        message: intl.formatMessage({ id: 'groupsView.groupsSavedSuccessMsg' }),
        visible: true,
      });
    } catch (groupError) {
      // eslint-disable-next-line no-console
      console.log('error:', groupError);
    }
  };

  const publishGroups = async () => {
    const { id } = course;
    const variables = { id };
    try {
      await publishCourseGroups({ variables });
      setGroupsPublished(true);
      setNotification({
        type: 'success',
        message: intl.formatMessage({ id: 'groupsView.publishGroupsSuccessMsg' }),
        visible: true,
      });
    } catch (publishError) {
      // eslint-disable-next-line no-console
      console.log(publishError);
    }
  };

  // cancel-button has some problems...
  const cancelGroups = () => {
    setGroups(oldGroups);
    setGroupsUnsaved(false);
    setRegistrationsWithoutGroups(true);
  };

  const handleSortGroups = value => {
    // Sorting currently does not preserve saved group names & messages correctly, so warn about reload
    if (
      groupsUnsaved &&
      // eslint-disable-next-line no-alert
      !window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))
    ) {
      return;
    }
    setGroupSorting(value);
    handleGroupsMessagesAndNames(sortGroups(groups, value));
    setGroupsUnsaved(false);
  };

  const sortOptions = [
    {
      key: 'By name, ascending',
      text: intl.formatMessage({ id: 'groupsView.orderByNameAsc' }),
      value: 'nameAscending',
    },
    {
      key: 'By name, descending',
      text: intl.formatMessage({ id: 'groupsView.orderByNameDesc' }),
      value: 'nameDescending',
    },
    {
      key: 'By size, ascending',
      text: intl.formatMessage({ id: 'groupsView.orderBySizeAsc' }),
      value: 'sizeAscending',
    },
    {
      key: 'By size, descending',
      text: intl.formatMessage({ id: 'groupsView.orderBySizeDesc' }),
      value: 'sizeDescending',
    },
  ];

  if (loading || !groups) {
    return <Loader active />;
  }

  if (generateGroupsLoading) {
    return <Loader active content={intl.formatMessage({ id: 'groupsView.generatingGroups' })} />;
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
                  onChange={event => setMinGroupSize(Number.parseInt(event.target.value, 10) || '')}
                />
              </Form.Field>
              <Form.Field>
                <Form.Select
                  label={
                    <h4>
                      <FormattedMessage id="groupsView.groupListingOrder" />
                    </h4>
                  }
                  placeholder="Sort groups..."
                  options={sortOptions}
                  defaultValue={groupSorting}
                  onChange={(e, { value }) => handleSortGroups(value)}
                />
              </Form.Field>
            </Form.Group>
            <ConfirmationButton
              onConfirm={handleGroupCreation}
              modalMessage={intl.formatMessage({ id: 'groupsView.confirmGroupGeneration' })}
              buttonDataCy="create-groups-submit"
              color="orange"
            >
              <FormattedMessage id="groupsView.generateGroups" />
            </ConfirmationButton>
            
            {groupsUnsaved && (
              <>
                <ConfirmationButton
                  onConfirm={saveSampleGroups}
                  modalMessage={intl.formatMessage({ id: 'groupsView.confirmGroupsSave' })}
                  buttonDataCy="save-groups-button"
                >
                  <FormattedMessage id="groupsView.saveGroups" />
                </ConfirmationButton>
                <ConfirmationButton
                  onConfirm={cancelGroups}
                  color="red"
                  modalMessage={intl.formatMessage({ id: 'groupsView.confirmCancelGroups' })}
                  buttonDataCy="cancel-groups-button"
                >
                  <FormattedMessage id="groupsView.cancelGroups" />
                </ConfirmationButton>
              </>
            )}

            {!groupsPublished && (
              <ConfirmationButton
                onConfirm={publishGroups}
                modalMessage={intl.formatMessage({ id: 'groupsView.publishGroupsConfirm' })}
                buttonDataCy="publish-groups-button"
                color="green"
              >
                <FormattedMessage id="groupsView.publishGroupsBtn" />
              </ConfirmationButton>
            )}
          </Form>
          <p />

          {groupsPublished && (
            <Alert severity="info">
              {intl.formatMessage({ id: 'groupsView.publishedGroupsInfo' })}
            </Alert>
          )}

          {groupsUnsaved && (
            <Alert severity="warning">
              {intl.formatMessage({ id: 'groupsView.unsavedGroupsInfo' })}
            </Alert>
          )}

          {registrationsWithoutGroups && (
            <GrouplessStudents
              grouplessStudents={grouplessStudents}
              setGrouplessStudents={setGrouplessStudents}
              setRegistrationsWithoutGroups={setRegistrationsWithoutGroups}
              course={course}
              regByStudentId={regByStudentId}
            />
          )}

          <Groups
            course={course}
            regByStudentId={regByStudentId}
            groupNames={groupNames}
            setGroupNames={setGroupNames}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            registrationsWithoutGroups={registrationsWithoutGroups}
            setRegistrationsWithoutGroups={setRegistrationsWithoutGroups}
            grouplessStudents={grouplessStudents}
            setGrouplessStudents={setGrouplessStudents}
          />
        </div>
      )}
    </div>
  );
};
