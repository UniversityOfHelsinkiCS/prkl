import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { Alert } from '@mui/material';
import timeChoices from '../../util/timeFormChoices';
import { concat } from 'lodash';

const makeEmptySheet = (hours, wdays) => {
  return wdays.reduce((sheet, day) => {
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
    userSelect: 'none',
  },
  tablecell: {
    border: '1px solid',
    fontWeight: 600,
    padding: 1,
    fontSize: '10pt',
  },
  

});

const TimeForm = ({ onChange, description, weekends, minHours, workTimeEndsAt, formControl, name }) => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const wdays = (!weekends && weekends !== null) ? concat(weekdays.slice(0,5)) : concat(weekdays)
  const intl = useIntl();
  const hours = (workTimeEndsAt!==null) ? Array.from(Array(workTimeEndsAt-8)).map((e,i)=>i+8) :  Array.from(Array(14)).map((e,i)=>i+8)
  const { register } = formControl;
  const [table, setTable] = useState(makeEmptySheet(hours, wdays));
  const [mouseDown, setMouseDown] = useState(false);
  const classes = useStyles();

  register({name}, { validate: tableAtSubmit => numberOfSelectedHours(tableAtSubmit, hours, wdays) >= minHours || `Please choose at least ${minHours} hours`})

  useEffect(() => {
    onChange(makeEmptySheet(hours, wdays));
  }, []); // eslint-disable-line

  const getCellIcon = choice => {
    switch (choice) {
      case timeChoices.yes:
        return <CheckIcon />;
      case timeChoices.maybe:
        return <HelpOutlineIcon />;
        case timeChoices.no:
          return <ClearIcon />;
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
        return '#EC0046';
        
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
        <Typography variant="h6" data-cy="time-table-minhours">
        Choose at least ({minHours}) hours
      </Typography>
      
      {Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Europe/Helsinki' ? (
        <Alert severity="warning">{intl.formatMessage({ id: 'timeForm.timeZoneWarning' })}</Alert>
        ) : null}
      <Table className={classes.table} size="small" padding="none" data-cy="time-table">
        <TableHead>
          {wdays.map(day => (
            <TableCell className={classes.tablecell} align="center">
              {intl.formatMessage({ id: `timeForm.${day}` })}
            </TableCell>
          ))}
        </TableHead>
        {hours.map(hour => (
          <TableRow>
            {wdays.map(day => (
              <TableCell
              className={classes.tablecell}
              align="center"
              fullWidth
              data-weekday={day}
              data-hour={hour}
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
                }}
                >
                {`${hour} - ${hour + 1} `}
                {getCellIcon(table[day][hour])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

const numberOfSelectedHours = (table, hours, wdays) => {
  const getWeekHours = day => {
    return hours.reduce((total, time) => {
      return day[time] === 'no' ? total : total + 1;
    }, 0);
  };
  
  return wdays.reduce((total, today) => {
    return total + getWeekHours(table[today]);
  }, 0);
};

export default TimeForm;
