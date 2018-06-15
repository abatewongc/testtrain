
import { EPV_LOAD } from "../constants/action-types"
import { EPV_CLEAR } from "../constants/action-types"

export const loadEndpoint = endpoint => ({ type: EPV_LOAD, payload: endpoint });
export const clearEndpoint = endpoint => ({ type: EPV_CLEAR, payload: endpoint });