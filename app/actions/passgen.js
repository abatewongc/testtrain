// @flow
import type { passGenStateType } from '../reducers/passgen';

type actionType = {
  +type: string
};

export const CREATE_PASSWORD = 'CREATE_PASSWORD';
export const CAPITALIZE = 'CAPITALIZE';

export function createPassword() {
  return {
    type: CREATE_PASSWORD
  };
}
