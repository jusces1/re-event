import { combineReducers } from "redux";
import { reducer as FormReducer } from 'redux-form';
import eventReducer from '../../features/event/eventReducer'
import modalReducer from "../../features/modals/modalReducer"
import authReducer  from "../../features/auth/authReducer";
import asyncReducer from "../../features/async/asyncReducer"
import {firebaseReducer } from 'react-redux-firebase'
import {firestoreReducer} from 'redux-firestore'
import {reducer as toastrReducer} from 'react-redux-toastr'


const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  form: FormReducer,
  events: eventReducer,
  modals: modalReducer,
  auth: authReducer,
  async: asyncReducer,
  toastr: toastrReducer
});

export default rootReducer;