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

const fetchArticlesListFetchingState = handleActions({
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
  [actions.fetchArticlesListSuccess](state, { payload }) {
    return {
      ...state,
      favoritedSlugs: [...state.favoritedSlugs, ...payload.favoritedSlugs],
      articles: [...state.articles, ...payload.articles],
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
  [actions.FavoriteControlSuccess](state, { payload }) {
    const { articles, favoritedSlugs } = state;
    const { slug, favorited } = payload;
    const articleIndex = articles.findIndex((item) => item.slug === slug );
    console.log(payload.favorited)
    const addToSlugs = () => {
      favoritedSlugs.push(slug)
      return favoritedSlugs
    }

    const deleteFromSlugs = () => {
      const favIndex = favoritedSlugs.findIndex((item) => item.slug === slug);
      favoritedSlugs.splice(favIndex, 1)
      return favoritedSlugs
    }
    
    articles[articleIndex] = payload;
    return {
      ...state,
      article: payload,
      articles: [...articles],
      favoritedSlugs: favorited ? addToSlugs()
      : deleteFromSlugs(),
    };
  },
}, {
  article: {}, articles: [],favoritedSlugs: [], loadedCount: 0, allCount: 0, errors: {},
});


export default combineReducers({
  favoriteControlState,
  SignUpFetchingState,
  PostArticleFetchingState,
  fetchArticlesListFetchingState,
  postArticleState,
  ArticleFetchingState,
  articlesList,
  userState,
  signUpState,
});
