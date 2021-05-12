import { makeStyles } from '@material-ui/core/styles';

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
