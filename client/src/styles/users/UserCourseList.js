import makeStyles from '@mui/styles/makeStyles';
import { blue } from '@mui/material/colors';

const useUserCourseListStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
  },
  head: {
    backgroundColor: blue[500],
    color: 'white',
  },
  row: {
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: blue[300],
    },
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useUserCourseListStyles };
