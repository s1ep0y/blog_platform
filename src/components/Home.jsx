import React from 'react';
import { uniqueId } from 'lodash';
import {
  Pagination, message
} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './../actions/articles';
import ArticleListItem from './ArticleListItem';
import {Loading3QuartersOutlined} from '@ant-design/icons';


const Home = (props) => {
  
  const {
    paginationControl,
    fetchArticlesListState,
    currentPage,
    articles,
    getArticle,
    articlesCount, login, favoriteControl, fetchArticles,
  } = props;

  if(fetchArticlesListState === 'requested') {
    return <div><Loading3QuartersOutlined spin style={{ fontSize: 48 }}/></div>;
  }
  
  if(articles.length === 0) {
    fetchArticles({
      offset: (currentPage - 1)*10,
      limit: 10,
    });
  }

  const paginationHandler = (page) => {
    fetchArticles({
      offset: (page - 1)*10,
      limit: 10,
    });
    paginationControl(page)
  }



  if(fetchArticlesListState === 'failed') {
    return <div>Something went wrong. Please, reload page</div>;
  }


  const likeControl = (slug, favorited) => (e) => {
    e.preventDefault();
    if (!login) {
      message.error('Please login to do it');
      return;
    }
    favoriteControl(slug, favorited);
  };
  const articlesPrepared = articles.map((item) => (
    <Link to={`/articles/${item.slug}`} key={uniqueId()} onClick={() => getArticle(item.slug)}>
      <ArticleListItem
        title={item.title}
        author={item.author.username}
        date={item.createdAt}
        tags={item.tagList}
        likes={item.favoritesCount}
        
        likeByUser={item.favorited}
        likeControl={likeControl(item.slug, item.favorited)}
      />
    </Link>
  ));

  return (
    <div className="wrapper">
      {articlesPrepared}
      <Pagination total={articlesCount} pageSize={10} current={currentPage} onChange={paginationHandler}/>
    </div>
  );
};

const actionCreators = {
  fetchArticles: actions.fetchArticles,
  favoriteControl: actions.favoriteControl,
  getArticle: actions.getArticle,
  paginationControl: actions.paginationControl,
};

const mapStateToProps = ({ articleReducers: {articlesList , fetchArticlesListState, favoriteControlState }, userReducers: {userState}}) => {
  const { articles, articlesCount, currentPage} = articlesList;
  if (fetchArticlesListState === 'success'){
    if (userState.loggedIn) {
      return {
        login: true, articles, articlesCount, currentPage, fetchArticlesListState, favoriteControlState
      };
    }
    return {
      articles, articlesCount,  currentPage, fetchArticlesListState
    };
  }
  return {fetchArticlesListState, currentPage};
};

Home.defaultProps = {
  login: false,
  articles: [],
  allCount: 0,
  articlesCount: 0,
  getArticle: () => {},
  fetchArticles: () => {},
  favoriteControl: () => {},
};

Home.propTypes = {
  articles: PropTypes.array,
  articlesCount: PropTypes.number,
  getArticle: PropTypes.func,
  fetchArticles: PropTypes.func,
  favoriteControl: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
