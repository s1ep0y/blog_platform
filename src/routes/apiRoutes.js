import { queries } from "@testing-library/react"

const baseApi = 'https://conduit.productionready.io/api'

export default {
    login: () => [baseApi,'users' ,'login'].join('/'),
    users: () => [baseApi, 'users'].join('/'),
    articles: (queries = '') => [baseApi, 'articles'].join('/') + queries,
    oneArticle: (name) => [baseApi, 'articles', name].join('/'),
    favArticle: (name) => [baseApi, 'articles', name, 'favorite'].join('/'),

}