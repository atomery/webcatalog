/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  DIALOG_LICENSE_REGISTRATION_CLOSE,
  DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
  DIALOG_LICENSE_REGISTRATION_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_LICENSE_REGISTRATION_CLOSE: return false;
    case DIALOG_LICENSE_REGISTRATION_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  licenseKey: '',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_LICENSE_REGISTRATION_CLOSE: return formInitialState;
    case DIALOG_LICENSE_REGISTRATION_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

export default combineReducers({
  form,
  open,
});
