import React, { useState } from 'react';
import { Table, Header, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { dummyEmail } from '../../util/privacyDefaults';
import HourDisplay from '../misc/HourDisplay';
import { useStore } from 'react-hookstore';

export default ({ group, groupTimes }) => {
  const [privacyToggle] = useStore('toggleStore');
  const [showTime, setShowTime] = useState(false);

  const handleShowTime = () => {
    setShowTime(!showTime);
  }

  return (
    <div key={group.id}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3" style={{ backgroundColor: "lightgrey" }}>
              <Header as="h3">
                {group.course.title}
                {groupTimes[group.id] ?
                  <Button floated="right" onClick={handleShowTime}>
                    <FormattedMessage id="groups.showTimes" />
                  </Button>
                : null}
              </Header>
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>
              <FormattedMessage id="courseRegistration.firstName" />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id="courseRegistration.lastName" />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id="courseRegistration.email" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {group.students.map(student => (
            <Table.Row key={student.id}>
              <Table.Cell>{student.firstname}</Table.Cell>
              <Table.Cell>{student.lastname}</Table.Cell>
              <Table.Cell>{privacyToggle ? dummyEmail : student.email}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {showTime ?
        <HourDisplay
          times={groupTimes[group.id]}
          students={group.students.length}
          groupId={group.id}
        /> : null}
      <p />
    </div>
  )
}