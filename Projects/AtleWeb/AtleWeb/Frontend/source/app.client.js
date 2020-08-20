import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Work from './pages/work';
import Home from './pages/home';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/work" component={Work} />
    </Switch>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('mount-point'));
