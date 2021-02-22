import React from 'react';
import { Table } from 'semantic-ui-react/';

const DraggableRow = ({ index, action, children, tableIndex }) => {
  const onDragStart = ev => {
    ev.dataTransfer.setData('index', index);
    ev.dataTransfer.setData('tableIndex', tableIndex);
  };

  const onDragOver = ev => {
    ev.preventDefault();
  };

  const onDrop = (ev, to) => {
    const from = ev.dataTransfer.getData('index');
    const fromTable = ev.dataTransfer.getData('tableIndex');
    action(parseInt(from, 10), parseInt(to, 10), fromTable, tableIndex);
  };

  return (
    <Table.Row
      draggable
      className="draggable"
      onDragStart={e => onDragStart(e)}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
      data-cy="draggable-row"
    >
      {children}
    </Table.Row>
  );
};

export default DraggableRow;
