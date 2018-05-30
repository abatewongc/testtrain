import { CREATE_PASSWORD } from '../actions/passgen';
var randomWords = require('random-words');

export type passGenStateType = {
  +output: string
};

type actionType = {
  +type: string
};

export default function passgen(state: string = '', action: actionType) {
  switch (action.type) {
    case CREATE_PASSWORD:
      return randomWords();
    default:
      return state;
  }
}
