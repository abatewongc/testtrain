'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = configureStore;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxLocalstorage = require('redux-localstorage');

var _reduxLocalstorage2 = _interopRequireDefault(_reduxLocalstorage);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _user = require('./reducers/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./actions/user');

var _user4 = _interopRequireDefault(_user3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(initialState, routerHistory) {
  var router = (0, _reactRouterRedux.routerMiddleware)(routerHistory);

  var actionCreators = (0, _extends3.default)({}, _user4.default, {
    push: _reactRouterRedux.push
  });

  var reducers = {
    user: _user2.default,
    routing: _reactRouterRedux.routerReducer
  };

  var middlewares = [_reduxThunk2.default, router];

  var composeEnhancers = function () {
    var compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === 'development' && compose_) {
      return compose_({ actionCreators: actionCreators });
    }
    return _redux.compose;
  }();

  var enhancer = composeEnhancers(_redux.applyMiddleware.apply(undefined, middlewares), (0, _reduxLocalstorage2.default)());
  var rootReducer = (0, _redux.combineReducers)(reducers);

  return (0, _redux.createStore)(rootReducer, initialState, enhancer);
}