import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useUserGroupItemStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
  },
  head: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontSize: 18,
  },
  subHeading: {
    backgroundColor: '#429aff',
    color: 'white',
    fontSize: 14,
  },
  row: {
    backgroundColor: theme.palette.action.hover,
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  button: {
    backgroundColor: grey[200],
    '&:hover': {
      backgroundColor: grey[400],
    },
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useUserGroupItemStyles };
