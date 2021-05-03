/* eslint-disable react/jsx-wrap-multilines */
import { useMutation, useQuery } from '@apollo/client';
import { blue, green, orange, red } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import {
  Typography,
  FormGroup,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLoaderStyle } from '../../styles/ui/Loader';
import { AppContext } from '../../App';
import {
  COURSE_GROUPS,
  GENERATE_GROUPS,
  PUBLISH_COURSE_GROUPS,
  SAVE_GROUPS,
} from '../../GqlQueries';
import userRoles from '../../util/userRoles';
import ConfirmationButton from '../ui/ConfirmationButton';
import GrouplessStudents from './GrouplessStudents';
import Groups from './Groups';
import { setNotification } from '../ui/Notification';

const useStyles = makeStyles({
  formInput: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  button: {
    marginRight: 5,
    marginBottom: 10,
  },
  alert: {
    marginBottom: 10,
  },
});

export default ({ course, registrations, regByStudentId, groups, setGroups }) => {
  const [generateGroups, { loading: generateGroupsLoading }] = useMutation(GENERATE_GROUPS);

  const [saveGeneratedGroups] = useMutation(SAVE_GROUPS);
  const [publishCourseGroups] = useMutation(PUBLISH_COURSE_GROUPS);

  const { user } = useContext(AppContext);

  const [grouplessStudents, setGrouplessStudents] = useStore('grouplessStudentsStore');
  const [lockedGroupsStore, setLockedGroupsStore] = useStore('lockedGroupsStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');

  const [registrationsWithoutGroups, setRegistrationsWithoutGroups] = useState(true);
  const [groupSorting, setGroupSorting] = useState('nameAscending');
  const [groupsPublished, setGroupsPublished] = useState(false);
  const [groupMessages, setGroupMessages] = useState(['']);
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [groupNames, setGroupNames] = useState(['']);
  const [oldGroups, setOldGroups] = useState([]);

  const intl = useIntl();

  const classes = useStyles();
  const loaderClass = useLoaderStyle();

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

    lockedGroups.forEach(group => {
      group.students.map(student => lockedRegistrationIds.push(student.id));
    });

    registrations.forEach(registration => {
      if (!lockedRegistrationIds.includes(registration.student.id)) {
        registrationIds.push(registration.id);
      }
    });

    const minGroupS = minGroupSize || 1;

    try {
      const res = await generateGroups({
        variables: {
          data: {
            courseId: course.id,
            targetGroupSize: minGroupS,
            registrationIds,
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

  const handleGroupCreation = () => {
    if (lockedGroupsStore.length === 0) {
      handleSampleGroupCreation();
    } else {
      generateNewGroupsForNonLockedGroups();
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
      setNotification(intl.formatMessage({ id: 'groupsView.groupsSavedSuccessMsg' }), 'success');
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
      setNotification(intl.formatMessage({ id: 'groupsView.publishGroupsSuccessMsg' }), 'success');
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

  const handleSortGroups = event => {
    // Sorting currently does not preserve saved group names & messages correctly, so warn about reload
    if (
      groupsUnsaved &&
      // eslint-disable-next-line no-alert
      !window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))
    ) {
      return;
    }
    setGroupSorting(event.target.value);
    handleGroupsMessagesAndNames(sortGroups(groups, event.target.value));
    setGroupsUnsaved(false);
  };

  const sortOptions = [
    {
      text: intl.formatMessage({ id: 'groupsView.orderByNameAsc' }),
      value: 'nameAscending',
    },
    {
      text: intl.formatMessage({ id: 'groupsView.orderByNameDesc' }),
      value: 'nameDescending',
    },
    {
      text: intl.formatMessage({ id: 'groupsView.orderBySizeAsc' }),
      value: 'sizeAscending',
    },
    {
      text: intl.formatMessage({ id: 'groupsView.orderBySizeDesc' }),
      value: 'sizeDescending',
    },
  ];

  if (generateGroupsLoading) {
    return <CircularProgress className={loaderClass.root} />;
  }

  /**
   * A simple function to check if groups are ok to be published
   * @returns {boolean}
   */
  const checkGroupPublishability = () => {
    return !groupsPublished && !groupsUnsaved && groups.length !== 0;
  };

  return (
    <div>
      <Prompt
        when={groupsUnsaved}
        message={intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' })}
      />
      {registrations.length === 0 ? (
        <Typography variant="h5">
          {intl.formatMessage({ id: 'groupsView.noRegistrations' })}
        </Typography>
      ) : (
        <div>
          <FormGroup row>
            <TextField
              className={classes.formInput}
              value={minGroupSize}
              type="number"
              min="1"
              max="9999999"
              label={intl.formatMessage({ id: 'groupsView.targetGroupSize' })}
              onChange={event => setMinGroupSize(Number.parseInt(event.target.value, 10) || '')}
              data-cy="target-group-size"
            />
            <FormControl className={classes.formInput}>
              <InputLabel id="group-listing-order">
                {intl.formatMessage({ id: 'groupsView.groupListingOrder' })}
              </InputLabel>
              <Select
                labelId="group-listing-order"
                value={groupSorting}
                onChange={handleSortGroups}
              >
                {sortOptions.map(option => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>

          <ConfirmationButton
            onConfirm={handleGroupCreation}
            color={orange[500]}
            modalMessage={intl.formatMessage({ id: 'groupsView.confirmGroupGeneration' })}
            buttonDataCy="create-groups-submit"
            className={classes.button}
          >
            <FormattedMessage id="groupsView.generateGroups" />
          </ConfirmationButton>

          {checkGroupPublishability() && (
            <ConfirmationButton
              onConfirm={publishGroups}
              color={green[500]}
              modalMessage={intl.formatMessage({ id: 'groupsView.publishGroupsConfirm' })}
              buttonDataCy="publish-groups-button"
              className={classes.button}
            >
              <FormattedMessage id="groupsView.publishGroupsBtn" />
            </ConfirmationButton>
          )}

          {groupsUnsaved && (
            <>
              <ConfirmationButton
                onConfirm={saveSampleGroups}
                color={blue[500]}
                modalMessage={intl.formatMessage({ id: 'groupsView.confirmGroupsSave' })}
                buttonDataCy="save-groups-button"
                className={classes.button}
              >
                <FormattedMessage id="groupsView.saveGroups" />
              </ConfirmationButton>
              <ConfirmationButton
                onConfirm={cancelGroups}
                color={red[500]}
                modalMessage={intl.formatMessage({ id: 'groupsView.confirmCancelGroups' })}
                buttonDataCy="cancel-groups-button"
                className={classes.button}
              >
                <FormattedMessage id="groupsView.cancelGroups" />
              </ConfirmationButton>
            </>
          )}

          {groupsPublished && (
            <Alert severity="info" className={classes.alert}>
              {intl.formatMessage({ id: 'groupsView.publishedGroupsInfo' })}
            </Alert>
          )}

          {groupsUnsaved && (
            <Alert severity="warning" className={classes.alert}>
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
              minGroupSize={minGroupSize}
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
          />
        </div>
      )}
    </div>
  );
};
