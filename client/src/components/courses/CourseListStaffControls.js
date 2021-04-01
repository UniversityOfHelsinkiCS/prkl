import React, { useContext } from 'react';
import { Checkbox, Loader } from 'semantic-ui-react';
import { AppContext } from '../../App';
import roles from '../../util/userRoles';

export default ({ controls }) => {

  const { user } = useContext(AppContext);

  const access = user.role >= roles.STAFF_ROLE;

  const createCheckbox = (text, onChange, checked) => {
    return (
      <Checkbox
        style={{ marginRight: '1rem' }}
        key={text}
        toggle
        label={text}
        onChange={onChange}
        checked={checked}
        data-cy="checkbox-staff-controls"
      />
    );
  };

  const createCheckboxes = () =>
    controls.map(item => createCheckbox(item.text, item.onChange, item.checked));

  return access ? <div>{createCheckboxes()}</div> : null;
};
