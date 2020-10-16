import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

function ConfirmationButton(
  { onConfirm, 
    modalMessage='Confirm action?', 
    children, 
    confirmButtonText='Confirm',
    cancelButtonText='Cancel',
    color='primary'}) {
  const [open, setOpen] = React.useState(false)

  const cancel = e => {
    e.preventDefault();
    setOpen(false);
  }

  const confirm = e => {
    e.preventDefault();
    setOpen(false);
    onConfirm();
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={<Button color={color} onClick={e => e.preventDefault()}>{children}</Button>}
    >
      <Modal.Header>
        <Icon name='exclamation circle' /> {modalMessage}
      </Modal.Header>
      <Modal.Actions>
        <Button basic color='red' onClick={cancel}>
          <Icon name='remove' /> {cancelButtonText}
        </Button>
        <Button data-cy="confirmation-button-confirm" color='green' onClick={confirm}>
          <Icon name='checkmark' /> {confirmButtonText}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmationButton