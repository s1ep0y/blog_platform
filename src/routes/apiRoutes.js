import { queries } from '@testing-library/react';

const baseApi = 'https://conduit.productionready.io/api';

export default {
  login: () => [baseApi, 'users', 'login'].join('/'),
  users: () => [baseApi, 'users'].join('/'),
  articles: (params = '') => [baseApi, 'articles'].join('/') + params,
  oneArticle: (name) => [baseApi, 'articles', name].join('/'),
  favArticle: (name) => [baseApi, 'articles', name, 'favorite'].join('/'),

};
