import makeStyles from '@mui/styles/makeStyles';
import { blue } from '@mui/material/colors';

const useUsersStyle = makeStyles({
  cardRoot: {
    marginBottom: 5,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  emptyHeader: {
    padding: 15,
    backgroundColor: '#ededed',
    fontSize: 20,
  },
  buttonDiv: {
    marginTop: 5,
  },
  activeRole: {
    backgroundColor: blue[500],
    marginRight: 5,
  },
  plainButtonMargin: {
    marginRight: 5,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { useUsersStyle };
