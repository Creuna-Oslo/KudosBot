import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Work from './pages/work';
import Home from './pages/home';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/work" component={Work} />
  </Switch>
);

export default Routes;
