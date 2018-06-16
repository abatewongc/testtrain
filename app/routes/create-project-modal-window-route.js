/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route } from 'react-router';
import App from '../containers/App';
import CreateProjectModalWindow from '../containers/ModalWindow/CreateProject/CreateProjectModalWindow';

export default () => (
  <App>
    <Route path="/" component={CreateProjectModalWindow} />
  </App>
);
