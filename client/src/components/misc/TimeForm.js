import React, { useState, useEffect, useCallback } from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles, Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useIntl } from 'react-intl';

import timeChoices from '../../util/timeFormChoices';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hours = [];
for (let i = 8; i < 22; i += 1) hours.push(i);

const makeEmptySheet = () => {
  return weekdays.reduce((sheet, day) => {
    sheet[day] = hours.reduce((acc, hour) => {
      acc[hour] = timeChoices.yes;
      return acc;
    }, {});
    return sheet;
  }, {});
};

const useStyles = makeStyles({
  table: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  tablecell: {
    border: '1px solid'
  }
});

const TimeForm = ({ onChange, description }) => {
  const intl = useIntl();

  const [table, setTable] = useState(makeEmptySheet());
  const [mouseDown, setMouseDown] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    onChange(makeEmptySheet());
  }, []); // eslint-disable-line

  const getCellIcon = choice => {
    switch (choice) {
      case timeChoices.yes:
        return <CheckIcon/>
      case timeChoices.maybe:
        return <HelpOutlineIcon/>;
      case timeChoices.no:
        return <ClearIcon/>
      default:
        throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
    }
  };

  const switchChoiceColor = choice => {
    switch (choice) {
      case timeChoices.yes:
        return '#87de54';
      case timeChoices.maybe:
        return 'yellow';
      case timeChoices.no:
        return '#ff004c';
      default:
        throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
    }
  };

  const handleClick = useCallback(e => {
    const day = e.currentTarget.dataset.weekday;
    const hour = parseInt(e.currentTarget.dataset.hour, 10);

    setTable(currentTable => {
      const switchChoice = choice => {
        switch (choice) {
          case timeChoices.yes:
            return timeChoices.maybe;
          case timeChoices.maybe:
            return timeChoices.no;
          case timeChoices.no:
            return timeChoices.yes;
          default:
            throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
        }
      };
      const toggleHour = (hoursToToggle, hourToToggle) => ({
        ...hoursToToggle,
        [hourToToggle]: switchChoice(hoursToToggle[hourToToggle]),
      });
      const newTable = {
        ...currentTable,
        [day]: toggleHour(currentTable[day], hour),
      };

      onChange(newTable);
      return newTable;
    });
  }, []); // eslint-disable-line

  return (
    <div>
      <h3>{description}</h3>

      {Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Europe/Helsinki' ? (
        <Alert severity="warning">{intl.formatMessage({ id: 'timeForm.timeZoneWarning' })}</Alert>
      ) : null}
      <Table className={classes.table} size="small" padding="none">
        <TableHead>
          {weekdays.map(day => (
            <TableCell className={classes.tablecell} align="center">
              {intl.formatMessage({ id: `timeForm.${day}` })}
            </TableCell>))}
        </TableHead>
          {hours.map(hour => 
            <TableRow>
              {weekdays.map(day => (
                <TableCell className={classes.tablecell} align="center" fullWidth data-weekday={day} data-hour={hour}
                    bgcolor={switchChoiceColor(table[day][hour])}
                     onMouseDown={e => {
                      handleClick(e);
                      setMouseDown(true);
                      }}
                      onMouseUp={() => {
                        setMouseDown(false);
                      }}
                      onMouseEnter={e => {
                        if (mouseDown) {
                          handleClick(e);
                        }
                      }}
                      onContextMenu={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }}>
                    {`${hour} - ${hour + 1} `}
                    {getCellIcon(table[day][hour])}
                </TableCell>
              ))}
            </TableRow>)}
      </Table>
    </div>
  );
};

export default TimeForm;
