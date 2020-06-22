import axios from 'axios';
import { createAction } from 'redux-actions';
import apiRoutes from '../routes/apiRoutes'

export const signInRequest = createAction('SIGN_IN_REQUEST');
export const signInSuccess = createAction('SIGN_IN_SUCCESS');
export const signInFailure = createAction('SIGN_IN_FAILURE');

export const userLoggedIn = createAction('USER_LOGGED_IN')

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

export const logOut = createAction('LOG_OUT');

export const FavoriteControl = (params) => async (dispatch) => {
  const [slug, favorited, token] = params;
  dispatch(FavoriteControlRequest())
  try {
    if(favorited) {
      const {data} = await axios.delete(apiRoutes.favArticle(slug), {}, {headers: {Authorization: `Token ${token}`}},)
      dispatch(FavoriteControlSuccess(data.article))
      return;
    }
    const {data} = await axios.post(apiRoutes.favArticle(slug), {}, {headers: {Authorization: `Token ${token}`}},)
    dispatch(FavoriteControlSuccess(data.article))
    return;
  } catch ({ response }) {
    console.log(response.data.errors)
  }
}

export const postArticle = ({ article, token }) => async (dispatch) => {
  dispatch(postArticleRequest());
  try {
    const { data } = await axios.post(apiRoutes.articles(),
    {article: { ...article, tagList: article.tagList}},
    {headers: {Authorization: `Token ${token}`}},
    )
    console.log(data)
    dispatch(postArticleSuccess());
  } catch ({ response }) {
    dispatch(postArticleFailure(response.data.errors));
    console.log(response)
  }
}

export const fetchArticles = ( params = {}) => async (dispatch) =>{
  dispatch(fetchArticlesListRequest());
  const queries = params.length !== 0 
    ? '?' + Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
    : []
  try {
    console.log(apiRoutes.articles(queries))
    const { data } = await axios.get(apiRoutes.articles(queries))
    dispatch(fetchArticlesListSuccess(data))
  } catch ({ response }) {
    console.log(response)
    dispatch(fetchArticlesListFailure(response.data.errors))
  }
}

export const signIn = (vals) => async (dispatch) => {
  dispatch(signInRequest());
  try {
    const  { data }  = await axios.post(apiRoutes.login(), vals);
    dispatch(signInSuccess(data));
  } catch ({ response }) {
    dispatch(signInFailure(response.data.errors));
  }
};

export const signUp = (vals) => async (dispatch) => {
  dispatch(signUpRequest());
  try {
    const { data } = await axios.post(apiRoutes.users(), vals);
    console.log(data)
    dispatch(signUpSuccess(data));
  } catch ({ response }) {
    dispatch(signUpFailure(response.data.errors));
  }
};

// const data = await axios.post('https://conduit.productionready.io/api/users', valsPrepared);
