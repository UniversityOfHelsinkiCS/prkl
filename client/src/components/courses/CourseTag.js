import React, { useEffect } from 'react';
import { Label } from 'semantic-ui-react';
import { useIntl } from 'react-intl';


export default ({course, user}) => {
  const intl = useIntl();

    return (
      <Label.Group>      
        {course.teachers.filter(teacher => teacher.id === user.id).length !== 0 ? <Label color='green'>{intl.formatMessage({ id: 'tag.own' })}</Label> : null}    
        {course.published ? null : <Label color='pink'>{intl.formatMessage({ id: 'tag.unpublished' })}</Label> }
        {new Date(course.deadline) < new Date() ? <Label color='red'>{intl.formatMessage({ id: 'tag.dl' })}</Label> : null}
      </Label.Group>
    );
};

// This didn't work due to user being undefined at first.
//{user.registrations.filter(r => r.course.id === course.id).length !== 0 ? <Label color='blue'>Enrolled</Label> : null}