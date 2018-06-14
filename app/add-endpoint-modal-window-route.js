/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route } from 'react-router';
import App from './containers/App';
import AddEndpointModalWindow from './containers/AddEndpointModalWindow';

export default () => (
  <App>
    <Route path="/" component={AddEndpointModalWindow} />
  </App>
);
