import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/user';

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
    localStorage.setItem('user', JSON.stringify(payload.user));
    return { loggedIn: true, errors: {}, user: payload.user };
  },
  [actions.signInFailure](state, { payload }) {
    return { loggedIn: false, errors: payload, user: {} };
  },
  [actions.LogOut]() {
    localStorage.removeItem('user');
    return { errors: {}, user: {}, loggedIn: false };
  },
  [actions.userLoggedIn](state, { payload }) {
    return { loggedIn: true, errors: {}, user: JSON.parse(payload) };
  },
  [actions.signUpSuccess](state) {
    return { ...state, errors: {} };
  },
  [actions.signUpFailure](state, { payload }) {
    return { ...state, errors: payload };
  },
}, { errors: {}, user: {}, loggedIn: false });


const signUpState = handleActions({
  [actions.signUpSuccess]() {
    return { status: 'success', errors: {} };
  },
  [actions.signUpFailure](state, { payload }) {
    return { status: 'fail', errors: payload };
  },
}, { status: '', errors: {}, user: {} });

export default combineReducers({
  userState,
  SignInFetchingState,
  SignUpFetchingState,
  signUpState,

});
