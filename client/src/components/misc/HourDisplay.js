import React from 'react';
import { useIntl } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red, orange, yellow, green } from '@material-ui/core/colors';

const useStyles = makeStyles({
  table: {
    overflow: 'hidden',
  },
  headerCell: {
    paddingRight: '10px',
    paddingLeft: '10px',
    textAlign: 'center',
  },
  contentRow: {
    height: '10px',
  },
  hourLabel: {
    padding: '0px 10px',
    textAlign: 'center',
    minWidth: '60px',
  },
  tableEntry: {
    padding: '0px 10px',
    textAlign: 'center',
  },
  // colors for table cells
  all: {
    backgroundColor: green.A400,
    border: 'solid',
    borderWidth: '1px',
    borderColor: green.A700,
  },
  overHalf: {
    backgroundColor: yellow[500],
    border: 'solid',
    borderWidth: '1px',
    borderColor: yellow.A700,
  },
  underHalf: {
    backgroundColor: orange[400],
    border: 'solid',
    borderWidth: '1px',
    borderColor: orange['600'],
  },
  none: {
    backgroundColor: red.A200,
    border: 'solid',
    borderWidth: '1px',
    borderColor: red['600'],
  },
});

const HourDisplay = ({ header, times, students, groupId }) => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const intl = useIntl();

  const classes = useStyles();

  if (!times) {
    return null;
  }
  // get the transpose of times
  const timesTranspose = times[0].map((col, i) => times.map(row => row[i]));

  const colorClass = timeSlot => {
    const ratio = timeSlot / students;
    if (ratio === 1) {
      return 'all';
    }
    if (ratio > 0.5) {
      return 'overHalf';
    }
    if (ratio > 0) {
      return 'underHalf';
    }
    return 'none';
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" className={classes.table}>
        <TableHead>
          {header && (
            <TableRow>
              <TableCell colSpan="8">{header}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className={classes.headerCell}>
              {intl.formatMessage({ id: 'timeForm.hours' })}
            </TableCell>
            {weekdays.map(day => (
              <TableCell key={day} className={classes.headerCell}>
                {intl.formatMessage({ id: `timeForm.${day}` })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timesTranspose.map((hours, index) => (
            <TableRow key={`${groupId}-${index}`} className={classes.contentRow}>
              <TableCell className={classes.hourLabel}>{`${index + 8}-${index + 9}`}</TableCell>
              {hours.map((timeSlot, timeSlotIndex) => (
                <TableCell
                  key={`${timeSlotIndex}-${groupId}-${index}`}
                  className={`${classes.tableEntry} ${classes[colorClass(timeSlot)]}`}
                >
                  {timeSlot}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HourDisplay;
