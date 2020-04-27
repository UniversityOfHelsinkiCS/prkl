import React from 'react';
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

  const hsl_col_perc = (percent, start, end) => {
    const b = (end - start) * percent;
    const c = b + start;

    // Return a CSS HSL string
    return 'hsl(' + c + ', 100%, 50%)';
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
                style={{ padding: 0, backgroundColor: hsl_col_perc(timeSlot / students, 0, 120) }}
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
