import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, blue, red, orange } from '@material-ui/core/colors';

const useButtonStyles = makeStyles({
  root: {
  }
});

const BlueButton = withStyles({
  root: {
    backgroundColor: blue[500],
  },
})(Button);

const GreenButton = withStyles({
  root: {
    backgroundColor: green[500],
  },
})(Button);

const OrangeButton = withStyles({
  root: {
    backgroundColor: orange[500],
  },
})(Button);

const RedButton = withStyles({
  root: {
    backgroundColor: red[500],
  },
})(Button);

export { useButtonStyles, BlueButton, GreenButton, OrangeButton, RedButton };
