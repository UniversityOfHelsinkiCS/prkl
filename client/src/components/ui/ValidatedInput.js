/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * HOC to make react-hook-form work with semantic-ui.
 * (Semantic does not expose ref, which is very bad and therefore it should not be used for
 * anything.)
 *
 * Extra props are passed to the child component so you can use this as if you were using the
 * inner Semantic component.
 */
const ValidatedInput = ({ name, type, formControl, ...rest }) => {
  const { setValue, trigger, errors, register } = formControl;
  const Inner = type;

  useEffect(() => {
    register({ name }, { required: true });
  });

  return (
    <Inner
      name={name}
      fluid
      onChange={(e, { value }) => {
        setValue(name, value);
        trigger(name);
      }}
      error={!!errors[name]}
      {...rest}
    />
  );
};

ValidatedInput.propTypes = {
  /** Unique name. */
  name: PropTypes.string.isRequired,
  /** Uninstated React component to render as input control (most likely a Semantic component.) */
  type: PropTypes.func.isRequired,
  /** Form control object generated with `react-hook-form`'s `useForm()`. */
  formControl: PropTypes.shape({
    setValue: PropTypes.func.isRequired,
    trigger: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
  }).isRequired,
};

export default ValidatedInput;