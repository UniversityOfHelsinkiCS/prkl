import { orange, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

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
