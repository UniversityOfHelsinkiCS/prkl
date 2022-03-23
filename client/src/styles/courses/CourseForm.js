import { makeStyles } from '@material-ui/core/styles';
import { green, blue } from '@material-ui/core/colors';

const useCourseFormStyles = makeStyles({
  addButton: {
    backgroundColor: green.A400,
    marginTop: 10,
  },

  searchButton: {
    marginTop: 10,
    paddingTop: 3,
    marginRight: 10,
    height: '53px',
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
  info: {
    color: blue[700],
    fontSize: 30,
    margin: 5,
  },
  slider: {
    padding: '0 30px'
  },
});

// eslint-disable-next-line import/prefer-default-export
export { useCourseFormStyles };
