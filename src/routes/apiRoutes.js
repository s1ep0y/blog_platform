const baseApi = 'https://conduit.productionready.io/api'

export default {
    login: () => [baseApi,'users' ,'login'].join('/'),
    users: () => [baseApi, 'users'].join('/'),
    articles: (quieris = []) => [baseApi, 'articles', ...quieris].join('/'),
    oneArticle: (name) => [baseApi, 'articles', name].join('/'),
    favArticle: (name) => [baseApi, 'articles', name, 'favorite'],

}