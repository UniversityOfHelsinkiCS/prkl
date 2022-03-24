import makeStyles from '@mui/styles/makeStyles';

const useCourseListStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: '98%',
    marginBottom: 10,
    paddingLeft: 20,
    '&:hover': {
      boxShadow: 'rgba(0, 0, 255, 0.5) 0px 1px 10px',
    },
  },
  coursePast: {
    minWidth: 275,
    maxWidth: '98%',
    marginBottom: 10,
    paddingLeft: 20,
    backgroundColor: '#e4e4e4 !important',
  },
  courseCode: {
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
});

// eslint-disable-next-line import/prefer-default-export
export { useCourseListStyles };
