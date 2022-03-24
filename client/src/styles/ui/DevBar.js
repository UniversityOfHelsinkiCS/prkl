import { blue, grey, orange, red } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';

const useDevBarStyles = makeStyles(theme => ({
  appbar: {
    backgroundColor: grey[900],
  },
  title: {
    marginRight: theme.spacing(2),
  },
  roleControls: {
    backgroundColor: blue[500],
    marginRight: theme.spacing(2),
  },
  dbControls: {
    backgroundColor: red[500],
    marginRight: theme.spacing(2),
  },
  mockingControls: {
    backgroundColor: orange[500],
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useDevBarStyles };
