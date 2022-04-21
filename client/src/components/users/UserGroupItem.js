import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  CardActions,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import HourDisplay from '../misc/HourDisplay';
import { useUserGroupItemStyles } from '../../styles/users/UserGroupItem';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export default ({ group, groupTimes, course }) => {
  const classes = useUserGroupItemStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        data-cy="user-group-view-group-name"
        style={{backgroundColor: "#03A9F4", color: "#FFFFFF"}}
        titleTypographyProps={{variant:'h6' }}
        title={course.title}
        subheader={group.groupName} 
        />
      <CardContent>
        {group.groupMessage && group.groupMessage !== '' && (
          <>
            <Typography variant="h5" gutterBottom>
              <FormattedMessage id="groups.newMessage" />
              &nbsp;
              {group.groupName}
            </Typography>
            <Typography variant="body1" className={classes.message}>
              {group.groupMessage}
            </Typography>
            <Divider />
          </>
        )}
        <List>
          {group.students.map(student => (
            <ListItem key={student.id}>
              <ListItemAvatar>
                <Avatar>{
                  student.firstname[0].toUpperCase()}{student.lastname[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
              primary={
                <Typography gutterBottom>
                  {student.firstname} {student.lastname}
                </Typography>}
              secondary={student.email}/>
            </ListItem>
          ))}
        </List>
      </CardContent>
    {groupTimes[group.id] && (
      <>
      <CardActions disableSpacing>
        <Button className={classes.fabButton}
        color='primary'
        variant="contained"
        onClick={() => handleExpandClick()}
        endIcon={<EventAvailableIcon />}>
          <FormattedMessage id="groups.showTimes" />
        </Button>
      </CardActions>
      <Collapse in={expanded}
      timeout="auto"
      unmountOnExit>
        <CardContent>
          <HourDisplay
            times={groupTimes[group.id]}
            students={group.students.length}
            groupId={group.id} />
        </CardContent>
      </Collapse></>
    )}
    </Card>
  );
};