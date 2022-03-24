import makeStyles from '@mui/styles/makeStyles';

const useHeaderStyles = makeStyles(theme => ({
  title: {
    marginRight: theme.spacing(2),
    color: 'inherit',
  },
  navigationButton: {
    textTransform: 'none',
    '&:hover': {
      background: 'none',
    },
  },
}));

// eslint-disable-next-line import/prefer-default-export
export { useHeaderStyles };
