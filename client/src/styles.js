import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles({
  userinfo: {
    something: ' '
  },
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

export { useStyles, useUserCourseListStyles };