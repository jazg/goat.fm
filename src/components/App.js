import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Search from './Search';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path='/' component={Search} />
        </div>
      </Router>
    );
  }
}

export default App;
