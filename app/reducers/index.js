// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import testprojectdisplay from './test-project-display';
import current_endpoint_reducer from './endpoint-viewer';


const rootReducer = combineReducers({
  router,
  testprojectdisplay,
  current_endpoint_reducer
});

export default rootReducer;
