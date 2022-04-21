import React from 'react';
import { useIntl } from 'react-intl';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Link,
  Divider,
  Popover,
  List,
  ListItem,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default ({ code, title, deadline, teachers, paragraphs }) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const divider = <span style={{ color: '#f2f2f2' }}>{' | '}</span>;

  return (
    <div>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            <Link href={`https://courses.helsinki.fi/fi/${code}`}>{code}</Link>
            {` - ${title}`}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {`${intl.formatMessage({ id: 'courses.deadline' })} ${intl.formatDate(deadline)}`}
            {divider}
            <Button
              onClick={handleClick}
              style={{
                color: 'inherit',
                textDecoration: 'inherit' /* does not work with mui makestyle! */,
              }}
            >
              {intl.formatMessage({ id: 'courseInfo.teachers' })}
              <ExpandMoreIcon fontSize="small" />
            </Button>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List>
                {teachers.map(t => (
                  <ListItem divider key={t.id}>
                    {t.firstname}
                    {t.lastname}
                    &nbsp;
                    {divider}
                    &nbsp;
                    <Link href={`mailto:${t.email}`}>{t.email}</Link>
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Typography>

          <Divider light />
          <br />

          <Typography component={'span'} variant="body1">
            {paragraphs.map(p => (
              <p key={p}>{p}</p>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
