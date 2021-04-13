import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: 20,
    maxWidth: 500,
  },
  info: {
    color: blue[700],
    fontSize: 30,
    margin: 5,
  },
});

const InfoPopup = ({ message }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <InfoIcon onMouseEnter={handleOpen} onMouseLeave={handleClose} className={classes.info} />
      <Popover
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
      >
        <Typography>{message}</Typography>
      </Popover>
    </div>
  );
};

export default InfoPopup;
