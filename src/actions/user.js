import axios from 'axios';
import { createAction } from 'redux-actions';
import apiRoutes from '../routes/apiRoutes';

export const signInRequest = createAction('SIGN_IN_REQUEST');
export const signInSuccess = createAction('SIGN_IN_SUCCESS');
export const signInFailure = createAction('SIGN_IN_FAILURE');

export const userLoggedIn = createAction('USER_LOGGED_IN');

export const signUpRequest = createAction('SIGN_UP_REQUEST');
export const signUpSuccess = createAction('SIGN_UP_SUCCESS');
export const signUpFailure = createAction('SIGN_UP_FAILURE');

export const LogOut = createAction('LOG_OUT');

export const signIn = (vals) => async (dispatch) => {
  dispatch(signInRequest());
  try {
    const { data } = await axios.post(apiRoutes.login(), vals);
    dispatch(signInSuccess(data));
  } catch ({ response }) {
    dispatch(signInFailure(response.data.errors));
  }
};

export const signUp = (vals) => async (dispatch) => {
  dispatch(signUpRequest());
  try {
    const { data } = await axios.post(apiRoutes.users(), vals);
    dispatch(signUpSuccess(data));
  } catch ({ response }) {
    dispatch(signUpFailure(response.data.errors));
  }
};
