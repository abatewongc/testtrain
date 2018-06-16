import { EPV_LOAD, EPV_CLEAR, EPV_EDIT } from "../constants/action-types";

const initialState = {
    current_endpoint: {},
    edit_endpoint: false
  };

const emptyState = {
    current_endpoint: {
        name: 'DISABLED',
        projectName: '',
        data: {},
        tefPath: '',
        disabled: true
    },
    edit_endpoint: false
}

const current_endpoint_reducer = (state = initialState, action) => {
    switch (action.type) {
      case EPV_LOAD:
        return { ...state, current_endpoint: action.payload };
      case EPV_CLEAR:
        return { ...state, current_endpoint: emptyState.current_endpoint };
      case EPV_EDIT:
        return { ...state, edit_endpoint: action.payload };
      default:
        return state;
    }
  };

export default current_endpoint_reducer;
