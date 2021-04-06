import { makeStyles } from '@material-ui/core/styles';

const useCourseListStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 10,
    paddingLeft: 20,
  },
  coursePast: {
    minWidth: 275,
    marginBottom: 10,
    paddingLeft: 20,
    backgroundColor: '#e4e4e4 !important',
  },
  code: {
    display: 'flex',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
  },
  title: {
    display: 'flex',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deadline: {
    display: 'flex',
    color: 'black',
  },
  description: {
    width: '50%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pos: {
    marginBottom: 12,
  },
});

// eslint-disable-next-line import/prefer-default-export
export { useCourseListStyles };
