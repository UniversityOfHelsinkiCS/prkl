import { makeStyles, Typography } from '@material-ui/core';
import { sum } from 'lodash';
import React from 'react';

const useClasses = makeStyles({
  matchingHourText: {
    padding: 10,
    margin: 10,
  },
});

const MatchingGroupHours = ({ matchingHours: hours, studentsInGroup }) => {
  const amountOfMatchingHours = hours?.flat().filter(hour => hour === studentsInGroup).length;
  const sumOfHours = sum(hours?.flat());
  const classes = useClasses();

  return (
    <>
      {amountOfMatchingHours || sumOfHours !== 0 ? (
        <Typography className={classes.matchingHourText} variant="h6">
          Matching hours (
          {amountOfMatchingHours}
          ) ⌛
        </Typography>
      ) : null}
    </>
  );
};

export default MatchingGroupHours;
