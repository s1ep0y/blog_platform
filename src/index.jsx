import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';
import reducers from './reducers/index.js'
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import * as actions from './actions/user';

/* eslint-disable no-underscore-dangle */
const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
const devtoolMiddleware = ext && ext();
/* eslint-enable */

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    devtoolMiddleware,
  ),
);

const user = localStorage.getItem('user')

if(user) store.dispatch(actions.userLoggedIn(user));

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
  <App /></Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

export {store}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
