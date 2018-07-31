import { EPV_LOAD, EPV_CLEAR, EPV_EDIT, EPV_UPDATETESTCASES } from "../constants/action-types"

export const loadEndpoint = endpoint => ({ type: EPV_LOAD, payload: endpoint });
export const clearEndpoint = endpoint => ({ type: EPV_CLEAR, payload: endpoint });
export const editEndpoint = edit => ({type: EPV_EDIT, payload: edit });
export const updateTestcases = update => ({type: EPV_UPDATETESTCASES, payload: update});
