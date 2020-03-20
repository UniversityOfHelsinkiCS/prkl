import React, { useState, useEffect, useCallback } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hours = [];
for (let i = 8; i < 22; i += 1) hours.push(i);

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
  const [mouseDown, setMouseDown] = useState(false);

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
    <Table
      unstackable
      compact="very"
      collapsing
      celled
      style={{
        cursor: 'pointer',
        userSelect: 'none',
      }}
      className="no_highlights"
    >
      <Table.Header>
        <Table.Row>
          {weekdays.map(day => (
            <Table.HeaderCell textAlign="center" key={day}>
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
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingRight: 15,
                  paddingLeft: 15,
                }}
                key={`${day}-${hour}`}
                textAlign="center"
                bgcolor={table[day][hour] ? '#ff004c' : '#87de54'}
                data-weekday={day}
                data-hour={hour}
                // onClick={handleClick}
                // onFocus={() => {
                //   console.log('focus');
                // }}
                onMouseDown={e => {
                  handleClick(e);
                  setMouseDown(true);
                }}
                onMouseUp={() => {
                  setMouseDown(false);
                }}
                onMouseEnter={e => {
                  if (mouseDown) {
                    handleClick(e);
                  }
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                // onTouchStart={e => {
                //   e.preventDefault();

                //   handleClick(e);
                //   setMouseDown(true);
                //   console.log('touch down');
                // }}
                // onTouchEnd={e => {
                //   e.preventDefault();
                //   setMouseDown(false);
                //   console.log('touch up');
                // }}
              >
                {`${hour} - ${hour + 1} `}
                <Icon name={table[day][hour] ? 'times' : 'checkmark'} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TimeForm;
