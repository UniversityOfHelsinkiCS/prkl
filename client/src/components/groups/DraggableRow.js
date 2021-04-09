import React from 'react';
import { TableRow } from '@material-ui/core';

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
    <TableRow
      draggable
      className="draggable"
      onDragStart={e => onDragStart(e)}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
      data-cy="draggable-row"
    >
      {children}
    </TableRow>
  );
};

export default DraggableRow;
