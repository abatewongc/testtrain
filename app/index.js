import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import CreateProjectRoot from './containers/CreateProjectModalWindowRoot';
import AddEndpointRoot from './containers/AddEndpointModalWindowRoot';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const store = configureStore();

if(document.title == 'Create TestTrain Project') {
  render(
    <AppContainer>
      <CreateProjectRoot store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
} else if(document.title == 'Add Endpoint') {
  render(
    <AppContainer>
      <AddEndpointRoot store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
} else {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
}

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
