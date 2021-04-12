import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useCourseFormStyles = makeStyles({
  addButton: {
    backgroundColor: green.A400,
    marginTop: 10,
  },
  closeRegButton: {
    marginTop: 10,
  },
  textField: {
    marginTop: 10,
    marginRight: 10,
  },
  alert: {
    marginTop: 10,
  },
  buttonGroup: {
    marginTop: 10,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { useCourseFormStyles };
