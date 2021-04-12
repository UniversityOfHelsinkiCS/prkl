import { makeStyles } from '@material-ui/core/styles';
import { green, red, grey } from '@material-ui/core/colors';

const useQuestionFormStyles = makeStyles({
  addButton: {
    backgroundColor: green.A400,
    marginTop: 10,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: red.A100,
    marginTop: 10,
  },
  textField: {
    marginTop: 10,
    marginRight: 10,
  },
  questionContainer: {
    border: 'solid',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: grey[600],
    padding: 10,
    maxWidth: 475,
    marginTop: 10,
    marginRight: 20,
    alignSelf: 'flex-start',
  },
  questionType: {
    marginTop: 10,
  },
  questionChoices: {
    marginTop: 10,
  },
  checkboxGroup: {
    marginTop: 10,
  },
  alert: {
    marginTop: 10,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { useQuestionFormStyles };
