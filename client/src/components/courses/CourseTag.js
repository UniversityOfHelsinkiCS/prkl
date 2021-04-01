import React from 'react';
import { useIntl } from 'react-intl';
import { useCourseTagStyles, BlueChip, RedChip, PinkChip, GreenChip } from '../../styles/courses/CourseTag'

export default ({ course, user }) => {
  const intl = useIntl();
  const classes = useCourseTagStyles();

  if (user && user.registrations) {
    return (
      <div className={classes.root}>
        {user.registrations.filter(r => r.course.id === course.id).length !== 0 ? (
          <BlueChip className={classes.enrolled} label="Enrolled" data-cy="tag-enrolled"/>
        ) : null}
        {course.teachers.filter(teacher => teacher.id === user.id).length !== 0 ? (
          <GreenChip className={classes.own} label={intl.formatMessage({ id: 'tag.own' })} data-cy="tag-own"/>
        ) : null}
        {course.published ? null : (
          <PinkChip className={classes.unpublished} label={intl.formatMessage({ id: 'tag.unpublished' })} data-cy="tag-unpublished"/>
        )}
        {new Date(course.deadline) < new Date() ? (
          <RedChip className={classes.deadline} label={intl.formatMessage({ id: 'tag.dl' })} data-cy="tag-dl"/>
        ) : null}
      </div>
    )
  }

  return null
};