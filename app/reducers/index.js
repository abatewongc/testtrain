// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import testprojectdisplay from './test-project-display';

const rootReducer = combineReducers({
  router,
  testprojectdisplay
});

export default rootReducer;
