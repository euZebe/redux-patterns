import React from 'react';
import Button from '@material-ui/core/Button';

const Pin = ({ value, isOn, toggle }) => (
  <Button
    variant='fab'
    color={isOn ? 'primary' : undefined}
    onClick={toggle}
  >
    {value}
  </Button>
);

Pin.propTypes = {};

Pin.defaultProps = {};

export default Pin;