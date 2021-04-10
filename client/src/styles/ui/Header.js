import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useHeaderStyles = makeStyles(theme => ({
  title: {
    marginRight: theme.spacing(2),
    color: "inherit"
  },
  navigationButton: {
    textTransform: "none",
    "&:hover": {
      background: "none"
    }
  }
}));

// eslint-disable-next-line import/prefer-default-export
export { useHeaderStyles };
