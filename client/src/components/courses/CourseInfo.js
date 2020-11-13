import React, { useState, useEffect } from 'react';
import { Header, Card } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export default ({id, deadline, teachers, paragraphs}) => {
  const intl = useIntl();

  return (
    <Card 
      key={id} 
      fluid
      color="blue"
      header={`${intl.formatMessage({
        id: 'courses.deadline',
      })} ${intl.formatDate(deadline)}`}
      
      extra={
        <div>
          <Header as="h4">
            <div>
              <p>Teachers: </p>
              {teachers ? (
                teachers.map(t => 
                  <p key={t.id}>{t.firstname} {t.lastname}</p>
                )
              ) : (
                null
              )}
            </div>
          </Header>
          <Header as="h4">
            {paragraphs.map(p => (
              <p key={p}>{p}</p>
            ))}
          </Header>
          &nbsp;
        </div>
      }
    />
  );
}