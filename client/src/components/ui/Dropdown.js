import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  },
});

export default ({ options, placeHolder }) => {
  const classes = useStyles();
  const [option, setOption] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = event => {
    setOption(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={option}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map(menuOption => (
            <MenuItem value={menuOption.id}>{menuOption.firstname}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
