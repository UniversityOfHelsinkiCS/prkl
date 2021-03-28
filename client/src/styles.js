import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

const useUserInfoStyles = makeStyles({
  // empty for now...
});

const useUserCourseListStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  head: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  row: {
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
        backgroundColor: '#0dadde',
    },
  },
}));

export { 
  useUserInfoStyles, 
  useUserCourseListStyles 
};