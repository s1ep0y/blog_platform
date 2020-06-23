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

export const postArticleRequest = createAction('POST_ARTICLE_REQUEST');
export const postArticleSuccess = createAction('POST_ARTICLE_SUCCESS');
export const postArticleFailure = createAction('POST_ARTICLE_FAILURE');

export const fetchArticlesListRequest = createAction('FETCH_ARTICLES_LIST_REQUEST');
export const fetchArticlesListSuccess = createAction('FETCH_ARTICLES_LIST_SUCCESS');
export const fetchArticlesListFailure = createAction('FETCH_ARTICLES_LIST_FAILURE');

export const FavoriteControlRequest = createAction('FAVORITE_CONTROL_REQUEST');
export const FavoriteControlSuccess = createAction('FAVORITE_CONTROL_SUCCESS');
export const FavoriteControlFailure = createAction('FAVORITE_CONTROL_FAILURE');

export const getArticleRequest = createAction('GET_ARTICLE_REQUEST');
export const getArticleSuccess = createAction('GET_ARTICLE_SUCCESS');
export const getArticleFailure = createAction('GET_ARTICLE_FAILURE');

export const LogOut = createAction('LOG_OUT');

export const paginationChange = createAction('PAGINATION_CHANGE')

export const paginationControl = (page) => (dispatch) => {
  
  
  dispatch(paginationChange(page))
}

export const handleLogOut = () => (dispatch) => {
  dispatch(LogOut())
}

export const getArticle = (slug) => async (dispatch) => {
  dispatch(getArticleRequest());
  try {
    const { data } = await axios.get(apiRoutes.oneArticle(slug))
    dispatch(getArticleSuccess(data.article))
  } catch (error) {
    console.log(error)
  }
}

export const favoriteControl = (slug, favorited) => async (dispatch, getState) => {
  const { userState: { user } } = getState()
  dispatch(FavoriteControlRequest());
  try {
    if (favorited) {
      const { data } = await axios.delete(apiRoutes.favArticle(slug), {
        headers: { Authorization: `Token ${user.token}` },
      });
      dispatch(FavoriteControlSuccess(data.article));
      return;
    }
    const { data } = await axios.post(apiRoutes.favArticle(slug), {}, { headers: { Authorization: `Token ${user.token}` }, data: {} });
    dispatch(FavoriteControlSuccess(data.article));
    return;
  } catch (e) {
    dispatch(FavoriteControlFailure())
    console.log(e);
  }
};

export const postArticle = (article) => async (dispatch, getState) => {
  dispatch(postArticleRequest());
  const { userState: { user } } = getState()
  try {
    const { data } = await axios.post(apiRoutes.articles(),
      { article: { ...article, tagList: article.tagList } },
      { headers: { Authorization: `Token ${user.token}` } });
    dispatch(postArticleSuccess(data));
  } catch ({ response }) {
    dispatch(postArticleFailure(response.data.errors));
    console.log(response);
  }
};

export const fetchArticles = (params = {}) => async (dispatch, getState) => {
  const { userState } = getState()
  const queries = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
  dispatch(fetchArticlesListRequest());
  try {
    const { data } = await axios.get(apiRoutes.articles('?' + queries));
    if (userState.status === 'success') {
      const favoritedData = await axios.get(apiRoutes.articles(`?favorited=${userState.user.username}&` + queries));
      const favoritedSlugs = favoritedData.data.articles.map((obj) => obj.slug);
      dispatch(fetchArticlesListSuccess({ articles: data.articles, articlesCount: data.articlesCount, favoritedSlugs }));
      return;
    }
    dispatch(fetchArticlesListSuccess({...data, favoritedSlugs: []}))
  } catch (error) {
    console.log(error)
    dispatch(fetchArticlesListFailure(error.response.data.errors));
  }
};

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
    console.log(data);
    dispatch(signUpSuccess(data));
  } catch ({ response }) {
    dispatch(signUpFailure(response.data.errors));
  }
};

// const data = await axios.post('https://conduit.productionready.io/api/users', valsPrepared);
