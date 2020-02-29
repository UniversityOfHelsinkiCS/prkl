/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';

/**
 * HOC to make react-hook-form work with semantic-ui.
 * (Semantic does not expose ref, which is very bad and therefore it should not be used for
 * anything.)
 *
 * Extra props are passed to the child component so you can use this as if you were using the
 * inner Semantic component.
 */
export default ({ name, type, formControl, ...rest }) => {
  const { setValue, triggerValidation, errors, register } = formControl;
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
        triggerValidation();
      }}
      error={!!errors[name]}
      {...rest}
    />
  );
};
