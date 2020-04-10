/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Semantic UI `Button` with confirmation prompt.
 * If the prop `formControl` is passed, it will be used to trigger validation before the button
 * prompts for confirmation. Extra props are passed to the child component.
 */
const ConfirmableButton = ({ onClick, prompt, children, formControl, ...rest }) => {
  const [confirm, setConfirm] = useState(false);

  const promptForConfirmation = async () => {
    if (formControl) {
      const { triggerValidation, errors } = formControl;
      await triggerValidation();

      if (Object.keys(errors).length !== 0) {
        return;
      }
    }

    setConfirm(true);
  };

  const InitialButton = () => (
    <Button onClick={promptForConfirmation} primary data-cy="submit-button" {...rest}>
      {children}
    </Button>
  );

  const PromptButton = () => (
    <Button onClick={onClick} negative data-cy="confirm-button" {...rest}>
      {prompt}
    </Button>
  );

  return confirm ? <PromptButton /> : <InitialButton />;
};

ConfirmableButton.propTypes = {
  /** Function to execute after confirmation. */
  onClick: PropTypes.func.isRequired,
  /** Content of the initial button. */
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  /** Content of the confirmation prompt button. */
  prompt: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  /** Form control object generated with `react-hook-form`'s `useForm()`. */
  formControl: PropTypes.shape({
    triggerValidation: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object).isRequired,
  }),
};

ConfirmableButton.defaultProps = {
  formControl: null,
};

export default ConfirmableButton;
