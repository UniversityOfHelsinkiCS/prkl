/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { Container, Paper, Typography, makeStyles, Box } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { count } from '../../util/functions';
import MatchingGroupHours from './Groups-components/MatchingGroupHours';

import Checkbox from './Groups-components/Checkbox';
import GroupTimes from './Groups-components/GroupTimes';
import GroupNameLabel from './Groups-components/GroupNameLabel';
import StudentTable from './Groups-components/GroupStudentsTable';
import GroupMessageField from './Groups-components/GroupMessageField';
import {
  ToggleGroupTimeButton,
  RemoveGroupButton,
  AddGroupButton,
} from './Groups-components/Buttons';

const useClasses = makeStyles({
  container: {
    padding: 10,
    borderRadius: 5,
    minWidth: '100%',
    maxWidth: '100%',
    backgroundColor: grey[200],
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
}) => {
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [groups] = useStore('groupsStore');
  const [showGroupTimes, setShowGroupTimes] = useState([]);
  const [groupTimesVisible, setGroupTimesVisible] = useState([]);
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
              <Box
                key={`groups-container-index-${tableIndex.toString()}`}
                data-cy="group-container"
                border={1}
                borderRadius={5}
                style={{ marginTop: 10 }}
              >
                <GroupNameLabel
                  groupNames={groupNames}
                  tableIndex={tableIndex}
                  setUnsaved={setUnsaved}
                  setGroupNames={setGroupNames}
                />
                <Checkbox group={group} />
                <GroupMessageField
                  setGroupMessages={setGroupMessages}
                  tableIndex={tableIndex}
                  setUnsaved={setUnsaved}
                  groupMessages={groupMessages}
                />
                <StudentTable
                  course={course}
                  regByStudentId={regByStudentId}
                  group={group}
                  tableIndex={tableIndex}
                  setRegistrationsWithoutGroups={setRegistrationsWithoutGroups}
                />
                <MatchingGroupHours
                  matchingHours={count(
                    group.students.map(student => regByStudentId[student.studentNo])
                  )}
                  studentsInGroup={
                    group.students.map(student => regByStudentId[student.studentNo]).length
                  }
                />
                <ToggleGroupTimeButton
                  groupTimesVisible={groupTimesVisible}
                  setGroupTimesVisible={setGroupTimesVisible}
                  showGroupTimes={showGroupTimes}
                  setShowGroupTimes={setShowGroupTimes}
                  tableIndex={tableIndex}
                  course={course}
                />
                <RemoveGroupButton
                  index={tableIndex}
                  setGroupNames={setGroupNames}
                  setGroupMessages={setGroupMessages}
                  setGroupsUnsaved={setGroupsUnsaved}
                  groupNames={groupNames}
                  groupMessages={groupMessages}
                />
                {showGroupTimes[tableIndex] ? (
                  <GroupTimes group={group} regByStudentId={regByStudentId} />
                ) : null}
              </Box>
            );
          })}
        </div>
      )}
      <AddGroupButton
        groupMessages={groupMessages}
        setGroupMessages={setGroupMessages}
        setGroupNames={setGroupNames}
        setGroupsUnsaved={setGroupsUnsaved}
        groupNames={groupNames}
        setShowGroupTimes={setShowGroupTimes}
        showGroupTimes={showGroupTimes}
      />
    </div>
  );
};
