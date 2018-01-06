import React, { Component } from 'react';
import './App.css';
import '../node_modules/tachyons/css/tachyons.css';
import Rx from 'rxjs/Rx';


//routes
import Routes from './routes';

class App extends Component {
  render() {
    return (
      <Routes/>
    )
  }
}

export default App;
