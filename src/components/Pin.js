import React from 'react';
import Button from '@material-ui/core/Button';

const Pin = ({ value, isDown, toggle }) => (
  <Button
    variant='fab'
    mini
    color={!isDown ? 'primary' : undefined}
    onClick={() => toggle(value)}
  >
    {value}
  </Button>
);

Pin.propTypes = {};

Pin.defaultProps = {};

export default Pin;