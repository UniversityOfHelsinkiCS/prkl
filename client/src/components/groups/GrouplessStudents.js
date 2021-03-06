import React from 'react';
import { useStore } from 'react-hookstore';
import { useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { red, grey } from '@material-ui/core/colors';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  makeStyles,
  Button,
  Popover,
  Box,
  List,
  ListItem,
} from '@material-ui/core';
import { FIND_GROUP_FOR_GROUPLESS_STUDENTS } from '../../GqlQueries';
import { setNotification } from '../ui/Notification';
import HourDisplay from '../misc/HourDisplay';
import { count } from '../../util/functions';
import Popup from '../ui/Popup';

const useStyles = makeStyles({
  box: {
    border: 1,
    padding: 10,
    bordercolor: grey[200],
  },
  table: {
    minWidth: 700,
  },
  label: {
    fontSize: 16,
    color: 'white',
    backgroundColor: red[700],
    padding: 8,
    fontWeight: 'bold',
  },
  heading: {
    backgroundColor: grey[100],
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    backgroundColor: grey[100],
    marginBottom: 5,
    position: 'relative',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%)',
    width: '98%',
    '&:hover': {
      backgroundColor: grey[300],
    },
  },
});

export default ({
  grouplessStudents,
  course,
  setGrouplessStudents,
  setRegistrationsWithoutGroups,
  regByStudentId,
  minGroupSize,
}) => {
  const [findGroupForGrouplessStudents] = useMutation(FIND_GROUP_FOR_GROUPLESS_STUDENTS);
  const [groups, setGroups] = useStore('groupsStore');
  // eslint-disable-next-line no-unused-vars
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');

  const intl = useIntl();
  const classes = useStyles();

  const handleSwitchingGroup = (student, toGroup) => {
    const newGroup = {
      ...groups[toGroup],
      students: groups[toGroup].students.concat(student),
    };
    const newGroups = groups.map((group, i) => (i === toGroup ? newGroup : group));
    setGroups(newGroups);

    const newGroupless = grouplessStudents.filter(groupless => groupless !== student);

    if (newGroupless.length > 0) {
      setRegistrationsWithoutGroups(true);
    } else {
      setRegistrationsWithoutGroups(false);
    }
    setGrouplessStudents(newGroupless);
    setGroupsUnsaved(true);
  };

  const findGroupForall = async () => {
    const groupsWithUserIds = groups.map(group => {
      const userIds = group.students.map(student => student.id);
      return {
        userIds,
        id: group.groupId,
        groupName: group.groupName,
        groupMessage: group.groupMessage,
      };
    });

    const grouplessUserId = grouplessStudents.map(student => student.id);

    const grouplessStudentsWithUserIds = grouplessStudents.map(() => {
      return {
        userIds: grouplessUserId,
        id: 'groupless',
        groupName: 'groupless',
        groupMessage: 'groupless',
      };
    });

    let studentsInGroups = 0;

    groups.forEach(g => {
      g.students.forEach(({ id }) => {
        if (id) {
          studentsInGroups += 1;
        }
      });
    });

    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      minGroupSize,
      groupless: { courseId: course.id, groups: grouplessStudentsWithUserIds },
    };

    try {
      const res = await findGroupForGrouplessStudents({
        variables,
      });

      const mappedGroups = res.data.findGroupForGrouplessStudents.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });

      setGroups(mappedGroups);

      const studentIds = [];

      mappedGroups.forEach(g => {
        g.students.forEach(({ id }) => {
          if (id) {
            studentIds.push(id);
          }
        });
      });

      const grouplessStudentIds = [];

      grouplessStudents.forEach(({ id }) => {
        if (id) {
          grouplessStudentIds.push(id);
        }
      });

      let groupless = false;

      grouplessStudentIds.forEach(id => {
        if (!studentIds.includes(id)) {
          groupless = true;
        }
      });

      if (studentIds.length !== studentsInGroups) {
        setGroupsUnsaved(true);
      }

      if (groupless) {
        setNotification(intl.formatMessage({ id: 'groupsView.grouplessStudentAlert' }), 'error');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  return (
    <div>
      <TableContainer data-cy="groupless-container" component={Paper}>
        <Typography data-cy="group-name-label" className={classes.label}>
          <FormattedMessage id="groupsView.grouplessHeader" />
        </Typography>
        <Box className={classes.box}>
          <Table className={classes.table}>
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
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {grouplessStudents.map(student => {
                return (
                  <TableRow key={student.id}>
                    <TableCell component="th" scope="row">
                      <Popup
                        content={
                          // eslint-disable-next-line react/jsx-wrap-multilines
                          <HourDisplay
                            groupId={student.id}
                            header={`${student.firstname} ${student.lastname}`}
                            students={1}
                            times={count([regByStudentId[student.studentNo]])}
                          />
                        }
                      >
                        {`${student.firstname} ${student.lastname}`}
                      </Popup>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {student.studentNo}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {student.email}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <PopupState variant="popover">
                        {popupState => (
                          <div>
                            <Button
                              variant="contained"
                              color="primary"
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              {...bindTrigger(popupState)}
                            >
                              {intl.formatMessage({ id: 'groups.moveToGroupButton' })}
                            </Button>
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
                                  {groups.map((group, index) => {
                                    return (
                                      <ListItem
                                        key={`groupless-students-list-item-${index.toString()}`}
                                        button
                                        onClick={() => handleSwitchingGroup(student, index)}
                                      >
                                        {group.groupName}
                                      </ListItem>
                                    );
                                  })}
                                </List>
                              </Box>
                            </Popover>
                          </div>
                        )}
                      </PopupState>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Button
          data-cy="find-group-for-all-button"
          className={classes.button}
          onClick={() => findGroupForall()}
        >
          {intl.formatMessage({ id: 'groupsView.findGroupForAll' })}
        </Button>
      </TableContainer>
    </div>
  );
};
