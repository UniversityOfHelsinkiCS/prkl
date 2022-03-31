import React, { useContext } from 'react';
import { makeStyles, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import roles from '../../util/userRoles';
import AppContext from '../../AppContext';

const useStyles = makeStyles({
  title: {
    display: 'flex',
  },
});

export default ({ controls }) => {
  const classes = useStyles();
  const { user } = useContext(AppContext);

  const access = user.role >= roles.STAFF_ROLE;

  const createCheckbox = (text, onChange, checked) => {
    return (
      <FormGroup className={classes.row}>
        <FormControlLabel
          label={text}
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Switch
              data-cy="checkbox-staff-controls"
              checked={checked}
              onChange={onChange}
              color="primary"
            />
          }
        />
      </FormGroup>
    );
  };

  const createCheckboxes = () =>
    controls.map(item => createCheckbox(item.text, item.onChange, item.checked));

  return access ? createCheckboxes() : null;
};
