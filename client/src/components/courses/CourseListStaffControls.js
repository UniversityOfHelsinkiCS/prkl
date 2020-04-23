import React from 'react';
import { useStore } from 'react-hookstore';
import { Checkbox } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import roles from '../../util/user_roles';

export default ({ onChange, checked }) => {
  const intl = useIntl();
  const [user] = useStore('userStore');
  const access = user.role >= roles.STAFF_ROLE;

  return access ? (
    <Checkbox
      toggle
      label={intl.formatMessage({ id: 'courses.showPastCoursesButtonLabel' })}
      onChange={onChange}
      checked={checked}
    />
  ) : null;
};
