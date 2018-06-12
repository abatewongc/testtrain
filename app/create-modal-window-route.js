/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import CreateModalWindow from './containers/CreateModalWindow';

export default () => (
  <App>
    <Route path="/" component={CreateModalWindow} />
  </App>
);
