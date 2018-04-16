import React, { Component } from 'react';
import DevTools from './components/DevTools';
import ArticleForm from './components/ArticleFormContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ArticleForm />
        <DevTools />
      </div>
    );
  }
}

export default App;
