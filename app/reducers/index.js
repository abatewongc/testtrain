// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import passgen from './passgen';

const rootReducer = combineReducers({
  passgen,
  counter,
  router
});

export default rootReducer;
