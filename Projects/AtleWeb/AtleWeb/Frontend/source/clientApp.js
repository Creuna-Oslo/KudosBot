import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './client';

const Client = () => (
  <Router>
    <Routes />
  </Router>
);

ReactDOM.render(<Client />, document.getElementById('mount-point'));
