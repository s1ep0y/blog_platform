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
    return 'success';
  },
}, 'none');

const favoriteControlState = handleActions({
  [actions.FavoriteControlRequest]() {
    return 'requested';
  },
  [actions.FavoriteControlFailure]() {
    return 'failed';
  },
  [actions.FavoriteControlSuccess]() {
    return 'success';
  },
}, 'none');

const PostArticleFetchingState = handleActions({
  [actions.postArticleRequest]() {
    return 'requested';
  },
  [actions.postArticleSuccess]() {
    return 'success';
  },
  [actions.postArticleFailure]() {
    return 'failed';
  },
}, 'none');

const ArticleFetchingState = handleActions({
  [actions.getArticleRequest]() {
    return 'requested';
  },
  [actions.getArticleSuccess]() {
    return 'success';
  },
  [actions.getArticleFailure]() {
    return 'failed';
  },
}, 'none');

const fetchArticlesListState = handleActions({
  [actions.fetchArticlesListRequest]() {
    return 'requested';
  },
  [actions.fetchArticlesListSuccess]() {
    return 'success';
  },
  [actions.fetchArticlesListFailure]() {
    return 'failed';
  },
}, 'none');

const userState = handleActions({
  [actions.signInSuccess](state, { payload }) {
    localStorage.setItem('user', JSON.stringify(payload.user));
    return { status: 'success', errors: {}, user: payload.user };
  },
  [actions.signInFailure](state, { payload }) {
    return { status: 'fail', errors: payload, user: {} };
  },
  [actions.LogOut]() {
    localStorage.removeItem('user');
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

const postArticleState = handleActions({
  [actions.postArticleSuccess]() {
    return { status: 'success', errors: {} };
  },
  [actions.postArticleFailure](state, { payload }) {
    return { status: 'error', errors: { errors: payload } };
  },
}, { status: 'success', errors: {} });

const articlesList = handleActions({
  [actions.signInSuccess](state, { payload }) {
    console.log(state.currentPage)
    return {...state, articles: [] }
  },
  [actions.LogOut](state){
    return {...state, articles: [], article: {}}
  },
  [actions.getArticleSuccess](state, { payload }) {
    return {
      ...state, article: payload, errors: {} }
      ;
  },
  [actions.getArticleRequest](state){
    return {...state, article: {}}
  },
  [actions.getArticleFailure](state, { payload }) {
    return { ...state ,errors: { errors: payload }, article: {} };
  },
  [actions.fetchArticlesListRequest](state) {
    return {...state}
  },
  [actions.fetchArticlesListSuccess](state, { payload }) {

    return {
      ...state,
      articlesCount: payload.articlesCount,
      articles: payload.articles,
      loadedCount: state.loadedCount + payload.articles.length,
      allCount: payload.articlesCount,
      
    };
  },
  [actions.fetchArticlesListFailure](state, { payload }) {
    return {
      ...state,
      errors: payload,
    };
  },
  [actions.paginationChange](state, {payload}){
    return {...state, currentPage: payload}
  },
  [actions.FavoriteControlSuccess](state, { payload }) {
    const { articles } = state;
    const { slug } = payload;
    const articleIndex = articles.findIndex((item) => item.slug === slug );
    articles[articleIndex] = payload;
    return {
      ...state,
      article: payload,
      articles
    };
  },
}, {
  article: {}, currentPage: 1 ,articles: [], articlesCount: 0, errors: {},
});


export default combineReducers({
  favoriteControlState,
  SignUpFetchingState,
  PostArticleFetchingState,
  fetchArticlesListState,
  postArticleState,
  ArticleFetchingState,
  articlesList,
  userState,
  signUpState,
});
