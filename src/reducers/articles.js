import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions/articles';
import { signInSuccess, LogOut } from '../actions/user';

const favoriteControlState = handleActions(
  {
    [actions.FavoriteControlRequest]() {
      return 'requested';
    },
    [actions.FavoriteControlFailure]() {
      return 'failed';
    },
    [actions.FavoriteControlSuccess]() {
      return 'finished';
    },
  },
  'none'
);

const PostArticleFetchingState = handleActions(
  {
    [actions.postArticleRequest]() {
      return 'requested';
    },
    [actions.postArticleSuccess]() {
      return 'finished';
    },
    [actions.postArticleFailure]() {
      return 'failed';
    },
  },
  'none'
);

const ArticleFetchingState = handleActions(
  {
    [actions.getArticleRequest]() {
      return 'requested';
    },
    [actions.getArticleSuccess]() {
      return 'finished';
    },
    [actions.getArticleFailure]() {
      return 'failed';
    },
  },
  'none'
);

const updateArticleFetchingState = handleActions(
  {
    [actions.updateArticleRequest]() {
      return 'requested';
    },
    [actions.updateArticleSuccess]() {
      return 'finished';
    },
    [actions.updateArticleFailure]() {
      return 'failed';
    },
  },
  'none'
);

const fetchArticlesListState = handleActions(
  {
    [actions.fetchArticlesListRequest]() {
      return 'requested';
    },
    [actions.fetchArticlesListSuccess]() {
      return 'success';
    },
    [actions.fetchArticlesListFailure]() {
      return 'failed';
    },
  },
  'none'
);

const postArticleState = handleActions(
  {
    [actions.postArticleSuccess]() {
      return { status: 'success', errors: {} };
    },
    [actions.postArticleFailure](state, { payload }) {
      return { status: 'error', errors: { errors: payload } };
    },
  },
  { status: 'success', errors: {} }
);

const sendedState = handleActions(
  {
    [actions.updateArticleSuccess]() {
      return true;
    },
    [actions.postArticleSuccess]() {
      return true;
    },
    [actions.dropSendedState]() {
      return false;
    },
  },
  false
);

const articlesState = handleActions(
  {
    [actions.postArticleFailure](state, { payload }) {
      return { ...state, errors: payload };
    },
    [actions.updateArticleFailure](state, { payload }) {
      return { ...state, errors: payload };
    },
    [actions.postArticleSuccess](state, { payload }) {
      return { ...state, article: payload.article, articles: [] };
    },
    [actions.updateArticleSuccess](state, { payload }) {
      return { ...state, article: payload.article, articles: [] };
    },
    [signInSuccess](state) {
      return { ...state, articles: [] };
    },
    [LogOut](state) {
      return { ...state, articles: [], article: {} };
    },
    [actions.getArticleSuccess](state, { payload }) {
      return { ...state, article: payload, errors: {} };
    },
    [actions.getArticleRequest](state) {
      return { ...state, article: {} };
    },
    [actions.getArticleFailure](state, { payload }) {
      return { ...state, errors: { errors: payload }, article: {} };
    },
    [actions.fetchArticlesListRequest](state) {
      return { ...state };
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
    [actions.paginationChange](state, { payload }) {
      return { ...state, currentPage: payload };
    },
    [actions.FavoriteControlSuccess](state, { payload }) {
      const { articles } = state;
      const { slug } = payload;
      const articleIndex = articles.findIndex((item) => item.slug === slug);
      articles[articleIndex] = payload;
      return {
        ...state,
        article: payload,
        articles,
      };
    },
  },
  {
    article: {},
    currentPage: 1,
    articles: [],
    articlesCount: 0,
    errors: {},
  }
);

export default combineReducers({
  updateArticleFetchingState,

  favoriteControlState,

  PostArticleFetchingState,
  fetchArticlesListState,
  postArticleState,
  ArticleFetchingState,
  articlesState,

  sendedState,
});
