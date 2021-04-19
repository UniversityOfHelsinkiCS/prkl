import Chip from '@material-ui/core/Chip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, blue, orange, red } from '@material-ui/core/colors';

const useCourseTagStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    borderRadius: 30,
    height: 30,
    marginBottom: 5,
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const BlueChip = withStyles({
  root: {
    backgroundColor: blue[500],
  },
})(Chip);

const GreenChip = withStyles({
  root: {
    backgroundColor: green[500],
  },
})(Chip);

const OrangeChip = withStyles({
  root: {
    backgroundColor: orange[500],
  },
})(Chip);

const RedChip = withStyles({
  root: {
    backgroundColor: red[500],
  },
})(Chip);

export { useCourseTagStyles, BlueChip, GreenChip, OrangeChip, RedChip };
