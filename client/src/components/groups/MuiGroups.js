/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStore } from 'react-hookstore';
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Button,
  Popover,
  Box,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Tooltip,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Info, SwapHoriz, Delete } from '@material-ui/icons/';
import { grey, green, red, blue } from '@material-ui/core/colors';

import _ from 'lodash';
import DraggableRow from './DraggableRow';
import HourDisplay from '../misc/HourDisplay';
import questionSwitch, { count } from '../../util/functions';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';

const useClasses = makeStyles({
  container: {
    padding: 10,
    borderRadius: 5,
    minWidth: '100%',
    maxWidth: '100%',
    backgroundColor: grey[200],
  },
  checkbox: {
    display: 'flex',
    paddingLeft: 10,
  },
  groupMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  groupMessageField: {
    paddingLeft: 10,
    fontSize: 12,
    width: '99%',
    marginBottom: 10,
  },
  heading: {
    backgroundColor: blue[100],
    fontWeight: 'bold',
    fontSize: 14,
    borderRadius: 5,
  },
  tableBox: {
    margin: 10,
    borderRadius: 5,
  },
  hourDisplayList: {
    display: 'flex',
    overflow: 'auto',
  },
  toggleButton: {
    backgroundColor: grey[100],
    padding: 10,
    margin: 10,
  },
  deleteIcon: {
    height: 40,
    width: 40,
    backgroundColor: red[600],
    '&:hover': {
      backgroundColor: red[400],
    },
  },
  switchIcon: {
    height: 40,
    width: 40,
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
});

export default ({
  course,
  regByStudentId,
  groupNames,
  setGroupNames,
  groupMessages,
  setGroupMessages,
  setRegistrationsWithoutGroups,
  grouplessStudents,
  setGrouplessStudents,
}) => {
  const [privacyToggle] = useStore('toggleStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [groups, setGroups] = useStore('groupsStore');
  const [lockedGroupsStore, setLockedGroupsStore] = useStore('lockedGroupsStore');

  const [showGroupTimes, setShowGroupTimes] = useState([]);
  const [groupTimesVisible, setGroupTimesVisible] = useState([]);

  const intl = useIntl();
  const classes = useClasses();

  useEffect(() => {
    if (groups.length > 0) {
      setShowGroupTimes(Array(groups.length).fill(false));
      setGroupTimesVisible(Array(groups.length).fill(false));
    }
  }, [groups]);

  const setUnsaved = () => {
    if (!groupsUnsaved) {
      setGroupsUnsaved(true);
    }
  };

  const handleGroupNameChange = (e, index) => {
    const newGroupNames = [...groupNames];
    newGroupNames[index] = e.target.value;
    setGroupNames(newGroupNames);
    setUnsaved();
  };

  const handleGroupMessageChange = (e, index) => {
    const newGroupMsgs = [...groupMessages];
    newGroupMsgs[index] = e.target.value;
    setGroupMessages(newGroupMsgs);
    setUnsaved();
  };

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

  const removeGroup = index => {
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

  const removeGroupButton = index => {
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

  const addGroupButton = () => {
    if (groups.length !== 0) {
      return (
        <Button style={{ marginTop: 15, backgroundColor: green[500] }} onClick={() => addGroup()}>
          <FormattedMessage id="groups.addGroupButton" />
        </Button>
      );
    }
    return null;
  };

  const swapElements = (fromIndex, toIndex, fromTable, toTable) => {
    if (fromTable === toTable) {
      return;
    }
    const newGroups = _.cloneDeep(groups);
    const removed = newGroups[fromTable].students.splice(fromIndex, 1);

    newGroups[toTable].students.splice(toIndex, 0, removed[0]);
    if (newGroups[fromTable].length === 0) {
      newGroups.splice(fromTable, 1);
    }
    setGroups(newGroups);
    setGroupsUnsaved(true);
  };

  const removeStudentFromGroup = (fromTable, fromIndex) => {
    const newGroups = _.cloneDeep(groups);
    const removed = newGroups[fromTable].students.splice(fromIndex, 1);

    setGroups(newGroups);
    setGrouplessStudents([...grouplessStudents, removed[0]]);
    setGroupsUnsaved(true);
    setRegistrationsWithoutGroups(true);
  };

  const handleShowGroupTimesClick = index => {
    const newGroupTimesVisible = [...groupTimesVisible];
    newGroupTimesVisible[index] = !groupTimesVisible[index];
    setGroupTimesVisible(newGroupTimesVisible);
    const newShowTimes = [...showGroupTimes];
    newShowTimes[index] = !newShowTimes[index];
    setShowGroupTimes(newShowTimes);
  };

  const popupTimesDisplay = student => (
    <HourDisplay
      groupId={student.id}
      header={`${student.firstname} ${student.lastname}`}
      students={1}
      times={count([regByStudentId[student.studentNo]])}
    />
  );

  const handleSwitchingGroup = (fromTableIndex, fromRowIndex, toTableIndex) => {
    const toRowIndex = groups[toTableIndex].students.length;
    swapElements(fromRowIndex, toRowIndex, fromTableIndex, toTableIndex);
  };

  const switchGroupOptions = groups.map((group, tableIndex) => ({
    key: tableIndex,
    text:
      group.groupName ||
      `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${tableIndex + 1}`,
    value: tableIndex,
  }));

  const checkBoxChange = group => {
    if (lockedGroupsStore.includes(group)) {
      const filtered = lockedGroupsStore.filter(g => g.groupId !== group.groupId);
      setLockedGroupsStore(filtered);
    } else {
      setLockedGroupsStore(lockedGroupsStore.concat(group));
    }
  };

  return (
    <div>
      {groups.length === 0 ? (
        <div>
          <Container className={classes.container} component={Paper}>
            <Typography variant="h5">
              <FormattedMessage id="groups.empty" />
            </Typography>
          </Container>
        </div>
      ) : (
        <div>
          {groups.map((group, tableIndex) => {
            return (
              <Box data-cy="group-container" border={1} borderRadius={5} style={{ marginTop: 10 }}>
                <Container className={classes.container} component={Paper}>
                  <PopupState variant="popover">
                    {popupState => (
                      <div>
                        <Typography
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...bindTrigger(popupState)}
                          data-cy="group-name-label"
                        >
                          {groupNames[tableIndex] || ''}
                        </Typography>
                        <Popover
                          data-cy="group-name-popup"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <TextField
                            data-cy="group-name-input"
                            onChange={e => handleGroupNameChange(e, tableIndex)}
                          />
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                </Container>
                <div className={classes.checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => checkBoxChange(group)}
                        color="primary"
                        data-cy="lockGroupsCheckBox"
                      />
                    }
                    label={intl.formatMessage({ id: 'groups.lockGroup' })}
                  />
                  <Tooltip title={intl.formatMessage({ id: 'groups.lockGroupInfo' })}>
                    <IconButton aria-label="delete">
                      <Info />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography className={classes.groupMessage}>
                  <FormattedMessage id="groups.message" />
                </Typography>
                <TextField
                  onChange={e => handleGroupMessageChange(e, tableIndex)}
                  data-cy="group-message-input"
                  placeholder={intl.formatMessage({ id: 'groups.messageInfo' })}
                  variant="outlined"
                  className={classes.groupMessageField}
                />
                <Typography className={classes.groupMessage}>
                  <FormattedMessage id="groups.students" />
                </Typography>
                <TableContainer data-cy="generated-groups">
                  <Box border={1} className={classes.tableBox}>
                    <Table>
                      <TableHead className={classes.heading}>
                        <TableRow>
                          <TableCell className={classes.heading}>
                            <FormattedMessage id="groups.name" />
                          </TableCell>
                          <TableCell className={classes.heading}>
                            <FormattedMessage id="groups.studentNumber" />
                          </TableCell>
                          <TableCell className={classes.heading}>
                            <FormattedMessage id="groups.email" />
                          </TableCell>
                          {course.questions.map(question =>
                            question.questionType !== 'times' ? (
                              <TableCell className={classes.heading} key={question.id}>
                                {question.content}
                              </TableCell>
                            ) : null
                          )}
                          <TableCell className={classes.heading}>
                            <FormattedMessage id="groups.options" />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.students.map((student, rowIndex) => (
                          <DraggableRow
                            key={student.id}
                            action={swapElements}
                            index={rowIndex}
                            tableIndex={tableIndex}
                          >
                            <TableCell>{`${student.firstname} ${student.lastname}`}</TableCell>

                            <TableCell>
                              {privacyToggle ? dummyStudentNumber : student.studentNo}
                            </TableCell>

                            <TableCell>{privacyToggle ? dummyEmail : student.email}</TableCell>

                            {regByStudentId[student.studentNo]?.questionAnswers.map(qa =>
                              questionSwitch(qa)
                            )}
                            <TableCell className={classes.checkbox}>
                              <PopupState variant="popover">
                                {popupState => (
                                  <div>
                                    <Tooltip title="Switch group">
                                      <IconButton
                                        data-cy="switch-group-button"
                                        variant="contained"
                                        color="primary"
                                        className={classes.switchIcon}
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...bindTrigger(popupState)}
                                      >
                                        <SwapHoriz />
                                      </IconButton>
                                    </Tooltip>
                                    <Popover
                                      data-cy="switch-group-popup"
                                      // eslint-disable-next-line react/jsx-props-no-spreading
                                      {...bindPopover(popupState)}
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                      }}
                                    >
                                      <Box p={2}>
                                        <List>
                                          {groups.map((g, index) => {
                                            return (
                                              <ListItem
                                                button
                                                data-cy="switch-group-select"
                                                onClick={() => handleSwitchingGroup(student, index)}
                                              >
                                                {g.groupName}
                                              </ListItem>
                                            );
                                          })}
                                        </List>
                                      </Box>
                                    </Popover>
                                  </div>
                                )}
                              </PopupState>
                              <Tooltip
                                title={intl.formatMessage({ id: 'groups.removeFromGroupLabel' })}
                              >
                                <IconButton
                                  data-cy="remove-from-group-button"
                                  onClick={() => removeStudentFromGroup(tableIndex, rowIndex)}
                                  aria-label="delete"
                                  className={classes.deleteIcon}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </DraggableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TableContainer>

                <Button
                  className={classes.toggleButton}
                  onClick={() => handleShowGroupTimesClick(tableIndex)}
                  disabled={!course.questions.some(q => q.questionType === 'times')}
                >
                  <FormattedMessage id="groups.toggleGroupTimes" />
                </Button>
                {removeGroupButton(tableIndex)}

                {showGroupTimes[tableIndex] ? (
                  <div className={classes.listDiv}>
                    <List className={classes.hourDisplayList}>
                      <ListItem>
                        <HourDisplay
                          header={intl.formatMessage({ id: 'groups.combinedHourDisplay' })}
                          groupId={group.id}
                          students={group.students.length}
                          times={count(
                            group.students.map(student => regByStudentId[student.studentNo])
                          )}
                        />
                      </ListItem>
                      {group.students.map(student => {
                        regByStudentId[student.studentNo].questionAnswers.map(qa =>
                          questionSwitch(qa)
                        );
                        return (
                          <ListItem>
                            <HourDisplay
                              groupId={student.id}
                              header={`${student.firstname} ${student.lastname}`}
                              students={1}
                              times={count([regByStudentId[student.studentNo]])}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </div>
                ) : null}
              </Box>
            );
          })}
        </div>
      )}
      <div>{addGroupButton()}</div>
    </div>
  );
};
