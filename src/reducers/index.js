import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { act } from 'react-dom/test-utils';

const SignInFetchingState = handleActions({
  [actions.signInRequest]() {
    return 'requested';
  },
  [actions.signInFailure]() {
    return 'failed';
  },
  [actions.signInSuccess]() {
    return 'finished';
  },
}, 'none');

const SignUpFetchingState = handleActions({
  [actions.signUpRequest]() {
    return 'requested';
  },
  [actions.signUpFailure]() {
    return 'failed';
  },
  [actions.signUpSuccess]() {
    return 'finished';
  },
}, 'none');

const userState = handleActions({
  [actions.signInSuccess](state, { payload }) {
    console.log(payload);
    return { status: 'success', errors: {}, user: payload.user };
  },
  [actions.signInFailure](state, { payload }) {
    return { status: 'fail', errors: payload, user: {} };
  },
  [actions.logOut](state, { payload }) {
    return { status: '', errors: {}, user: {} }
  },
}, { status: '', errors: {}, user: {} });

const signUpState = handleActions({
  [actions.signUpSuccess](state, { payload }) {
    console.log(payload);
    return { status: 'success', errors: {} };
  },
  [actions.signUpFailure](state, { payload }) {
    console.log(payload);
    return { status: 'fail', errors: payload };
  },
}, { status: '', errors: {}, user: {} });

export default combineReducers({
  SignInFetchingState,
  SignUpFetchingState,
  userState,
  signUpState,
});
