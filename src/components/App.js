import React, { Component } from 'react';
import styled from 'styled-components';
import Molkky from './MolkkyContainer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Molkky />
      </Container>
    );
  }
}

export default App;
