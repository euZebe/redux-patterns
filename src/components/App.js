import React, { Component } from 'react';
import styled from 'styled-components';
import DevTools from './DevTools';
import Molkky from './MolkkyContainer';

const Container = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 30vw 1fr;
  
  @media (max-width: 700px) {
    grid-template-rows: 100vh 0;
    grid-template-columns: 1fr;
  }
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Molkky />
        <DevTools />
      </Container>
    );
  }
}

export default App;
