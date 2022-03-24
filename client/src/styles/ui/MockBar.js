import { orange, grey } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';

const useMockBarStyles = makeStyles(theme => ({
  appbar: {
    backgroundColor: grey[900],
  },
  typography: {
    marginRight: theme.spacing(2),
  },
  mockingControls: {
    backgroundColor: orange[500],
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useMockBarStyles };
