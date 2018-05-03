import React, { Component } from 'react';
import DevTools from './components/DevTools';
import ArticleForm from './components/ArticleFormContainer';
import LastUpdates from './components/LastUpdatesContainer';
import ActionDispatchingSeveralTimes from './components/ActionDispatchinSeveralTimes';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <ArticleForm />
          <LastUpdates />
          <ActionDispatchingSeveralTimes />
        </div>
        <DevTools />
      </div>
    );
  }
}

export default App;
