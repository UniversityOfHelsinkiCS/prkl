import Chip from '@mui/material/Chip';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import { green, blue, orange, red } from '@mui/material/colors';

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
