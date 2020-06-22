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

const PostArticleFetchingState = handleActions({
  [actions.postArticleRequest]() {
    return 'requested';
  },
  [actions.postArticleSuccess]() {
    return 'failed';
  },
  [actions.postArticleFailure]() {
    return 'finished';
  },
}, 'none');

const fetchArticlesListFetchingState = handleActions({
  [actions.fetchArticlesListRequest]() {
    return 'requested';
  },
  [actions.fetchArticlesListSuccess]() {
    return 'failed';
  },
  [actions.fetchArticlesListFailure]() {
    return 'finished';
  },
}, 'none');

const userState = handleActions({
  [actions.signInSuccess](state, { payload }) {
    localStorage.setItem('user', JSON.stringify(payload.user))
    return { status: 'success', errors: {}, user: payload.user };
  },
  [actions.signInFailure](state, { payload }) {
    return { status: 'fail', errors: payload, user: {} };
  },
  [actions.logOut]() {
    localStorage.removeItem('user')
    return { status: '', errors: {}, user: {} };
  },
  [actions.userLoggedIn](state, { payload }) {
    return { status: 'success', errors: {}, user: JSON.parse(payload) };
  },
}, { status: '', errors: {}, user: {} });

const signUpState = handleActions({
  [actions.signUpSuccess]() {
    return { status: 'success', errors: {} };
  },
  [actions.signUpFailure](state, { payload }) {
    return { status: 'fail', errors: payload };
  },
}, { status: '', errors: {}, user: {} });

const articleState = handleActions({
  [actions.postArticleSuccess](){
    return { status: 'success', errors: {}};
  },
  [actions.postArticleFailure](state, {payload}){
    return {status: 'error', errors: {errors: payload}}
  },
}, { status: 'success', errors: {}})

const articlesList = handleActions({
  [actions.fetchArticlesListSuccess](state, { payload }){
    const newArticles = payload.articles
    return {
      articles: [...state.articles, ...newArticles],
      loadedCount: state.loadedCount + newArticles.length,
      allCount: payload.articlesCount,
    };
  },
  [actions.fetchArticlesListFailure](state, { payload }){
    return {
      ...state,
      errors: payload
    }
  },
  [actions.FavoriteControlSuccess](state, {payload}) {
    const { articles } = state;
    const index = articles.findIndex((item => item.slug === payload.slug))
    console.log(articles[index])
    articles[index] = payload;
    console.log(articles[index])
    return {
      articles, ...state
    }
  }
}, {articles: [], loadedCount: 0, allCount: 0, errors: {}})



export default combineReducers({
  SignInFetchingState,
  SignUpFetchingState,
  PostArticleFetchingState,
  fetchArticlesListFetchingState,
  articleState,
  articlesList,
  userState,
  signUpState,
});
