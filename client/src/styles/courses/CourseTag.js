import Chip from '@material-ui/core/Chip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, blue, pink, red } from '@material-ui/core/colors';

const useCourseTagStyles = makeStyles((theme) => ({
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
    backgroundColor: blue[500]
  }
})(Chip);

const GreenChip = withStyles({
  root: {
    backgroundColor: green[500],
  }
})(Chip);

const PinkChip = withStyles({
  root: {
    backgroundColor: pink[200]
  }
})(Chip);

const RedChip = withStyles({
  root: {
    backgroundColor: red[500]
  }
})(Chip);

export {
  useCourseTagStyles,
  BlueChip,
  GreenChip,
  PinkChip,
  RedChip
}