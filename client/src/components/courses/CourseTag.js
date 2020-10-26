import React from 'react';
import { Label } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export default ({ course, user }) => {
  const intl = useIntl();

  if (user && user.registrations) {
    return (
      <Label.Group>
        {user.registrations.filter(r => r.course.id === course.id).length !== 0 ? (
          <Label color="blue" data-cy="tag-enrolled">Enrolled</Label>
        ) : null}
        {course.teachers.filter(teacher => teacher.id === user.id).length !== 0 ? (
          <Label color="green" data-cy="tag-own">{intl.formatMessage({ id: 'tag.own' })}</Label>
        ) : null}
        {course.published ? null : (
          <Label color="pink" data-cy="tag-unpublished">{intl.formatMessage({ id: 'tag.unpublished' })}</Label>
        )}
        {new Date(course.deadline) < new Date() ? (
          <Label color="red" data-cy="tag-dl">{intl.formatMessage({ id: 'tag.dl' })}</Label>
        ) : null}
      </Label.Group>
    );
  }

  return null;
};
