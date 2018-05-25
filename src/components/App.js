import React, { Component } from 'react';
import DevTools from './DevTools';
import './App.css';
import Molkky from './MolkkyContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Molkky />
        <DevTools />
      </div>
    );
  }
}

export default App;
