import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tab } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hours = [];
for (let i = 8; i < 22; i++) hours.push(i);

const makeEmptySheet = () => {
  return weekdays.reduce((sheet, day) => {
    sheet[day] = hours.reduce((acc, hour) => {
      acc[hour] = false;
      return acc;
    }, {});
    return sheet;
  }, {});
};

const TimeForm = ({ onChange }) => {
  const intl = useIntl();

  const [table, setTable] = useState(makeEmptySheet());

  useEffect(() => {
    onChange(makeEmptySheet());
  }, []);

  const handleClick = useCallback(e => {
    const day = e.currentTarget.dataset.weekday;
    const hour = parseInt(e.currentTarget.dataset.hour, 10);

    setTable(currentTable => {
      const toggleHour = (hoursToToggle, hourToToggle) => ({
        ...hoursToToggle,
        [hourToToggle]: !hoursToToggle[hourToToggle],
      });
      const newTable = {
        ...currentTable,
        [day]: toggleHour(currentTable[day], hour),
      };

      onChange(newTable);
      return newTable;
    });
  }, []);

  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          {weekdays.map(day => (
            <Table.HeaderCell key={day}>
              {intl.formatMessage({ id: `timeForm.${day}` })}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {hours.map(hour => (
          <Table.Row key={hour}>
            {weekdays.map(day => (
              <Table.Cell
                key={`${day}-${hour}`}
                textAlign="center"
                selectable
                negative={table[day][hour]}
                data-weekday={day}
                data-hour={hour}
                onClick={handleClick}
              >
                {hour} -{hour + 1}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TimeForm;
