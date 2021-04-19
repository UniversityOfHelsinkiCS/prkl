import React, { useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

import { AppContext } from '../../App';
import roles from '../../util/userRoles';

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
          control={<Switch data-cy="checkbox-staff-controls" checked={checked} onChange={onChange} color="primary" />}
        />
      </FormGroup>
    );
  };

  const createCheckboxes = () =>
    controls.map(item => createCheckbox(item.text, item.onChange, item.checked));

  return access ? createCheckboxes() : null;
};
