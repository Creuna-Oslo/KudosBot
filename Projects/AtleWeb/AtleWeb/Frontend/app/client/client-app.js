import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';

const Client = () => (
  <Router>
    <Routes />
  </Router>
);

ReactDOM.hydrate(<Client />, document.getElementById('mount-point'));
