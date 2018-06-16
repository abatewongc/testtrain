import { EPV_LOAD } from "../constants/action-types";
import { EPV_CLEAR } from "../constants/action-types";

const initialState = {
    current_endpoint: {}
  };

const emptyState = {
    current_endpoint: {
        name: 'DISABLED',
        projectName: '',
        data: {},
        tefPath: '',
        disabled: true
    }
}

const current_endpoint_reducer = (state = initialState, action) => {
    switch (action.type) {
      case EPV_LOAD:
        return { ...state, current_endpoint: action.payload };
      case EPV_CLEAR:
        return { ...state, current_endpoint: emptyState.current_endpoint };
      default:
        return state;
    }
  };
export default current_endpoint_reducer;
