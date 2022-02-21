import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useClasses = makeStyles({
  matchingHourText: {
    padding: 10,
    margin: 10,
  },
});

const MatchingGroupHours = ({ matchingHours: hours, studentsInGroup }) => {
  const amountOfMatchingHours = hours?.flat().filter(hour => hour === studentsInGroup).length;
  // const hoursTotal = hours?.flat().length;
  const classes = useClasses();

  return (
    <>
      {amountOfMatchingHours &&  
      <Typography className={classes.matchingHourText} variant="h6">
        Matching hours ({amountOfMatchingHours}) ⌛
      </Typography>
      }
    </>


  );

};

export default MatchingGroupHours;
