/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { useStore } from 'react-hookstore';
import { makeStyles, Tooltip, IconButton, Button } from '@material-ui/core';
import _ from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { Delete } from '@material-ui/icons/';
import { red, grey, green } from '@material-ui/core/colors';

const useClasses = makeStyles({
  deleteIcon: {
    height: 40,
    width: 40,
    backgroundColor: red[600],
    '&:hover': {
      backgroundColor: red[400],
    },
  },
  toggleButton: {
    backgroundColor: grey[100],
    padding: 10,
    margin: 10,
  },
});

export const AddGroupButton = ({
  groupMessages,
  setGroupMessages,
  setGroupNames,
  setGroupsUnsaved,
  groupNames,
  setShowGroupTimes,
  showGroupTimes,
}) => {
  const [groups, setGroups] = useStore('groupsStore');
  const intl = useIntl();

  const addGroup = () => {
    const newGroups = _.cloneDeep(groups);
    const newGroupName = `${intl.formatMessage({
      id: 'groupsView.defaultGroupNamePrefix',
    })} ${groups.length + 1}`;
    newGroups.push({
      groupId: '',
      students: [],
      groupMessage: '',
      groupName: newGroupName,
    });
    setGroups(newGroups);

    const newGroupMsgs = [...groupMessages];
    newGroupMsgs.push('');
    setGroupMessages(newGroupMsgs);

    const newGroupNames = [...groupNames];
    newGroupNames.push(newGroupName);
    setGroupNames(newGroupNames);

    setShowGroupTimes(showGroupTimes.push(false));

    setGroupsUnsaved(true);
  };

  if (groups.length !== 0) {
    return (
      <Button style={{ marginTop: 15, backgroundColor: green[500] }} onClick={() => addGroup()}>
        <FormattedMessage id="groups.addGroupButton" />
      </Button>
    );
  }
  return null;
};

export const RemoveGroupButton = ({
  index,
  setGroupNames,
  setGroupMessages,
  setGroupsUnsaved,
  groupNames,
  groupMessages,
}) => {
  const [groups, setGroups] = useStore('groupsStore');
  const [showGroupTimes, setShowGroupTimes] = useState([]);

  const removeGroup = () => {
    const newGroups = _.cloneDeep(groups);
    newGroups.splice(index, 1);
    setGroups(newGroups);

    const newGroupNames = [...groupNames];
    newGroupNames.splice(index, 1);
    setGroupNames(newGroupNames);

    const newGroupMsgs = [...groupMessages];
    newGroupMsgs.splice(index, 1);
    setGroupMessages(newGroupMsgs);

    const newShowGroups = [...showGroupTimes];
    newShowGroups.splice(index, 1);
    setShowGroupTimes(newShowGroups);
    setGroupsUnsaved(true);
  };

  if (index >= groups.length) return null;

  if (groups.length > 1 && groups[index].students.length === 0) {
    return (
      <Button
        data-cy="group-remove-button"
        size="mini"
        style={{ backgroundColor: red[600], padding: 10 }}
        onClick={() => removeGroup(index)}
      >
        <FormattedMessage id="groups.removeGroupButton" />
      </Button>
    );
  }
  return null;
};

export const ToggleGroupTimeButton = ({
  groupTimesVisible,
  setGroupTimesVisible,
  showGroupTimes,
  setShowGroupTimes,
  tableIndex,
  course,
}) => {
  const classes = useClasses();
  const handleShowGroupTimesClick = index => {
    const newGroupTimesVisible = [...groupTimesVisible];
    newGroupTimesVisible[index] = !groupTimesVisible[index];
    setGroupTimesVisible(newGroupTimesVisible);
    const newShowTimes = [...showGroupTimes];
    newShowTimes[index] = !newShowTimes[index];
    setShowGroupTimes(newShowTimes);
  };

  return (
    <Button
      className={classes.toggleButton}
      onClick={() => handleShowGroupTimesClick(tableIndex)}
      disabled={!course.questions.some(q => q.questionType === 'times')}
    >
      <FormattedMessage id="groups.toggleGroupTimes" />
    </Button>
  );
};

export const RemoveStudentButton = ({ tableIndex, rowIndex, setRegistrationsWithoutGroups }) => {
  const classes = useClasses();
  const intl = useIntl();

  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [groups, setGroups] = useStore('groupsStore');
  const [grouplessStudents, setGrouplessStudents] = useStore('grouplessStudentsStore');

  const removeStudentFromGroup = (fromTable, fromIndex) => {
    const newGroups = _.cloneDeep(groups);
    const removed = newGroups[fromTable].students.splice(fromIndex, 1);

    setGroups(newGroups);
    setGrouplessStudents([...grouplessStudents, removed[0]]);
    setGroupsUnsaved(true);
    setRegistrationsWithoutGroups(true);
  };

  return (
    <Tooltip title={intl.formatMessage({ id: 'groups.removeFromGroupLabel' })}>
      <IconButton
        data-cy="remove-from-group-button"
        onClick={() => removeStudentFromGroup(tableIndex, rowIndex)}
        aria-label="delete"
        className={classes.deleteIcon}
      >
        <Delete />
      </IconButton>
    </Tooltip>
  );
};
