import React from 'react';
import styled from 'styled-components';
import Pin from './Pin';

const Container = styled.span`
  margin: 1em;
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-gap: 0.4em;
  justify-items: center;
`;

const PreparedPins = ({ pins, toggle }) => (
  <span>
  <Container>
    {pins.map(p =>
      <Pin key={p.value} value={p.value} isDown={p.isDown} toggle={toggle} />
    )}
  </Container>
  </span>
);

PreparedPins.propTypes = {};

PreparedPins.defaultProps = {};

export default PreparedPins;