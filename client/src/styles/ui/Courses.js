import makeStyles from '@mui/styles/makeStyles';

const useCoursesStyles = makeStyles(theme => ({
  searchbar: {
    marginRight: theme.spacing(3),
  },
  orderby: {
    marginRight: theme.spacing(3),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useCoursesStyles };
