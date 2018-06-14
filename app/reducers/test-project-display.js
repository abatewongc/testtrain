const ADD_NEW_PROJECT = 'ADD_NEW_PROJECT';
const REMOVE_PROJECT = 'REMOVE_PROJECT'

const initialState = {
  menu: {}
};

const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case ADD_NEW_PROJECT:
      newState.openedDirectories = Object.assign({}, newState.openedDirectories, { [action.filePath]: action.files });
      break;
    case REMOVE_PROJECT:
      break;
    default:
      return state;
  }
  return newState;
};

export default reducer;

export const addNewProject = filePath => ({ type: ADD_NEW_PROJECT, filePath });
export const removeProject = filePath => ({ type: REMOVE_PROJECT, filePath });
