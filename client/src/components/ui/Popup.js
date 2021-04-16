import React from 'react';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: 20,
    maxWidth: 500,
  },
});

const Popup = ({ children, content }) => {
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
      <div onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        {children}
      </div>
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
        disableScrollLock
      >
        {content}
      </Popover>
    </div>
  );
};

export default Popup;
