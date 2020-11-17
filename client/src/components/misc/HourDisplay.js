import React, { useEffect } from 'react';
import { Table, Header } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

const HourDisplay = ({ header, times, students, groupId }) => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const intl = useIntl();

  if (!times) {
    return null;
  }
  // get the transpose of times
  const timesTranspose = times[0].map((col, i) => times.map(row => row[i]));

  const hsl_col_code = (timeSlot) => {
    const ratio = timeSlot / students;
    let code = 0; // red

    if (ratio === 1){
      code = 120; // green
    } else if (ratio > 0.5) {
      code = 60; // yellow
    } else if (ratio > 0) {
      code = 30; // orange
    }

    // Return a CSS HSL string
    return `hsl(${code}, 100%, 70%)`
  };

  return (
    <Table unstackable celled collapsing textAlign="center" size="small" style={{ marginRight: 0 }}>
      <Table.Header>
        {header ? (
          <Table.Row>
            <Table.HeaderCell colSpan="8">
              <Header>{header}</Header>
            </Table.HeaderCell>
          </Table.Row>
        ) : null}

        <Table.Row>
          <Table.HeaderCell textAlign="center">
            {intl.formatMessage({ id: `timeForm.hours` })}
          </Table.HeaderCell>
          {weekdays.map(day => (
            <Table.HeaderCell textAlign="center" key={day}>
              {intl.formatMessage({ id: `timeForm.${day}` })}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {timesTranspose.map((hours, index) => (
          <Table.Row key={`${groupId}-${index}`}>
            <Table.Cell style={{ padding: 0 }}>{`${index + 8}-${index + 9}`}</Table.Cell>
            {hours.map((timeSlot, timeSlotIndex) => (
              <Table.Cell
                key={`${timeSlotIndex}-${groupId}-${index}`}
                style={{ padding: 0, backgroundColor: hsl_col_code(timeSlot) }}
              >
                {timeSlot}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default HourDisplay;
