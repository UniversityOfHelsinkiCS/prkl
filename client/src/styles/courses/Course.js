import { makeStyles } from '@material-ui/core';

const useCourseStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useCourseStyle };
