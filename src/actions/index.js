import axios from 'axios';
import { createAction } from 'redux-actions';

export const signInRequest = createAction('SIGN_IN_REQUEST');
export const signInSuccess = createAction('SIGN_IN_SUCCESS');
export const signInFailure = createAction('SIGN_IN_FAILURE');

export const signUpRequest = createAction('SIGN_UP_REQUEST');
export const signUpSuccess = createAction('SIGN_UP_SUCCESS');
export const signUpFailure = createAction('SIGN_UP_FAILURE');

export const logOut = createAction('LOG_OUT')

export const signIn = (vals) => async (dispatch) => {
  dispatch(signInRequest());
  try {
    const { data } = await axios.post('https://conduit.productionready.io/api/users/login', vals);
    dispatch(signInSuccess(data));
  } catch ({ response }) {
    dispatch(signInFailure(response.data.errors));
  }
};

export const signUp = (vals) => async (dispatch) => {
  dispatch(signUpRequest());
  try {
    const { data } = await axios.post('https://conduit.productionready.io/api/users', vals);
    dispatch(signUpSuccess(data));
  } catch ({ response }) {
    dispatch(signUpFailure(response.data.errors));
  }
};

// const data = await axios.post('https://conduit.productionready.io/api/users', valsPrepared);
