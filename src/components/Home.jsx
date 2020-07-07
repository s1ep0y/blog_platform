import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import {
  Pagination, message,
} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import * as actions from '../actions/articles';
import ArticleListItem from './ArticleListItem';


const Home = (props) => {
  const {
    paginationControl,
    fetchArticlesListState,
    currentPage,
    articles,
    getArticle,
    articlesCount, login, favoriteControl, fetchArticles,
  } = props;

  const [limit, setLimit] = useState(10);

  if (fetchArticlesListState === 'requested') {
    return <div><Loading3QuartersOutlined spin style={{ fontSize: 48 }} /></div>;
  }

  if (articles.length === 0) {
    fetchArticles({
      offset: (currentPage - 1) * limit,
      limit: 10,
    });
  }

  const onShowSizeChange = (current, size) => {
    setLimit(size);
    fetchArticles({
      offset: (current - 1) * size,
      limit: size,
    });
  };

  const paginationHandler = (page) => {
    fetchArticles({
      offset: (page - 1) * limit,
      limit,
    });
    paginationControl(page);
  };


  if (fetchArticlesListState === 'failed') {
    return <div>Something went wrong. Please, reload page</div>;
  }


  const likeControl = (slug, favorited) => (event) => {
    event.preventDefault();
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
        body={item.body}
        likeByUser={item.favorited}
        likeControl={likeControl(item.slug, item.favorited)}
      />
    </Link>
  ));

  return (
    <div className="wrapper">
      {articlesPrepared}
      <Pagination
        total={articlesCount}
        pageSize={limit}
        current={currentPage}
        showSizeChanger
        onChange={paginationHandler}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

const actionCreators = {
  fetchArticles: actions.fetchArticles,
  favoriteControl: actions.favoriteControl,
  getArticle: actions.getArticle,
  paginationControl: actions.paginationControl,
};

const mapStateToProps = ({
  articleReducers:
  { articlesState, fetchArticlesListState, favoriteControlState },
  userReducers: { userState },
}) => {
  const { articles, articlesCount, currentPage } = articlesState;
  if (fetchArticlesListState === 'success') {
    if (userState.loggedIn) {
      return {
        login: true,
        articles,
        articlesCount,
        currentPage,
        fetchArticlesListState,
        favoriteControlState,
      };
    }
    return {
      articles, articlesCount, currentPage, fetchArticlesListState,
    };
  }
  return { fetchArticlesListState, currentPage };
};

Home.defaultProps = {
  login: false,
  articles: [],
  articlesCount: 0,
  getArticle: () => {},
  fetchArticles: () => {},
  favoriteControl: () => {},
  paginationControl: () => {},
  fetchArticlesListState: '',
  currentPage: 0,
};

Home.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.any),
  articlesCount: PropTypes.number,
  getArticle: PropTypes.func,
  fetchArticles: PropTypes.func,
  favoriteControl: PropTypes.func,
  fetchArticlesListState: PropTypes.string,
  currentPage: PropTypes.number,
  login: PropTypes.bool,
  paginationControl: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
