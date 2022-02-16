import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import _ from 'lodash';
import {
  Box,
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import DraggableRow from '../DraggableRow';
import { RemoveStudentButton } from './Buttons';
import SwitchGroupButton from './SwitchGroupButton';
import questionSwitch from '../../../util/functions';
import StudentTimeDisplayPopup from './StudentTimeDisplayPopup';

const useClasses = makeStyles({
  tableBox: {
    margin: 10,
    borderRadius: 5,
  },
  heading: {
    backgroundColor: blue[100],
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttons: {
    display: 'flex',
    paddingLeft: 10,
  },
  studentsMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
});

export default ({ course, regByStudentId, group, tableIndex, setRegistrationsWithoutGroups }) => {
  const classes = useClasses();
  const [groups, setGroups] = useStore('groupsStore');
  // eslint-disable-next-line no-unused-vars
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');

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

  return (
    <div>
      <Typography className={classes.studentsMessage}>
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
              {group.students.length === 0 ? (
                <DraggableRow action={swapElements} index={0} tableIndex={tableIndex}>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </DraggableRow>
              ) : (
                <>
                  {group.students.map((student, rowIndex) => (
                    <DraggableRow
                      key={student.id}
                      action={swapElements}
                      index={rowIndex}
                      tableIndex={tableIndex}
                    >
                      <TableCell>
                        <StudentTimeDisplayPopup
                          student={student}
                          regByStudentId={regByStudentId}
                        />
                      </TableCell>
                      <TableCell>{student.studentNo}</TableCell>
                      <TableCell>{student.email}</TableCell>

                        {regByStudentId[student.studentNo]?.questionAnswers.map(x => x).sort((a,b) => a.question.order-b.question.order).map(qa => questionSwitch(qa))}
  
                      
                      
                      <TableCell className={classes.buttons}>
                        <SwitchGroupButton setGroupsUnsaved={setGroupsUnsaved} student={student} />
                        <RemoveStudentButton
                          tableIndex={tableIndex}
                          rowIndex={rowIndex}
                          setRegistrationsWithoutGroups={setRegistrationsWithoutGroups}
                        />
                      </TableCell>
                    </DraggableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </div>
  );
};
