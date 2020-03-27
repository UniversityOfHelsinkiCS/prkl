import React, { useState, useEffect, useCallback } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import timeChoices from '../../util/timeFormChoices';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hours = [];
for (let i = 8; i < 22; i += 1) hours.push(i);

const makeEmptySheet = () => {
  return weekdays.reduce((sheet, day) => {
    sheet[day] = hours.reduce((acc, hour) => {
      acc[hour] = timeChoices.yes;
      return acc;
    }, {});
    return sheet;
  }, {});
};

const TimeForm = ({ onChange, description }) => {
  const intl = useIntl();

  const [table, setTable] = useState(makeEmptySheet());
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    onChange(makeEmptySheet());
  }, []);

  const switchChoiceIcon = choice => {
    switch (choice) {
      case timeChoices.yes:
        return 'check';
      case timeChoices.maybe:
        return 'question';
      case timeChoices.no:
        return 'times';
      default:
        throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
    }
  };

  const switchChoiceColor = choice => {
    switch (choice) {
      case timeChoices.yes:
        return '#87de54';
      case timeChoices.maybe:
        return 'yellow';
      case timeChoices.no:
        return '#ff004c';
      default:
        throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
    }
  };

  const handleClick = useCallback(e => {
    const day = e.currentTarget.dataset.weekday;
    const hour = parseInt(e.currentTarget.dataset.hour, 10);

    setTable(currentTable => {
      const switchChoice = choice => {
        switch (choice) {
          case timeChoices.yes:
            return timeChoices.maybe;
          case timeChoices.maybe:
            return timeChoices.no;
          case timeChoices.no:
            return timeChoices.yes;
          default:
            throw new Error(`Unexpected switch fallthrough with choice: ${choice}`);
        }
      };
      const toggleHour = (hoursToToggle, hourToToggle) => ({
        ...hoursToToggle,
        [hourToToggle]: switchChoice(hoursToToggle[hourToToggle]),
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
    <div>
      <h3>{description}</h3>

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
                  bgcolor={switchChoiceColor(table[day][hour])}
                  data-weekday={day}
                  data-hour={hour}
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
                >
                  {`${hour} - ${hour + 1} `}
                  <Icon name={switchChoiceIcon(table[day][hour])} />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default TimeForm;
