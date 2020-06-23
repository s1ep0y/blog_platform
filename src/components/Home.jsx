import React, { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import {
  Button,
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import ArticleListItem from './ArticleListItem';


const Home = (props) => {
  const [loaded, setLoaded] = useState(false);
  
  const {
    articles, getArticle, allCount, loadedCount, login, user, favoriteControl, fetchArticles,
  } = props;
  if (!loaded) {
    fetchArticles();
    setLoaded(true);
  }


  const likeControl = (slug, favorited) => (e) => {
    e.preventDefault();
    if (!login) {
      alert('need to loign');
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
    </div>
  );
};

const actionCreators = {
  fetchArticles: actions.fetchArticles,
  favoriteControl: actions.favoriteControl,
  getArticle: actions.getArticle,
};

const mapStateToProps = ({ articlesList, userState }) => {
  const { articles, allCount, loadedCount } = articlesList;
  const { status, user } = userState;
  if (status === 'success') {
    return {
      user, login: true, articles, allCount, loadedCount,
    };
  }
  return {
    articles, allCount, loadedCount,
  };
};

Home.defaultProps = {
  login: false,
  articles: [],
  allCount: 0,
  loadedCount: 0,
  getArticle: () => {},
  fetchArticles: () => {},
  favoriteControl: () => {},
};

Home.propTypes = {
  articles: PropTypes.array,
  allCount: PropTypes.number,
  loadedCount: PropTypes.number,
  getArticle: PropTypes.func,
  fetchArticles: PropTypes.func,
  favoriteControl: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
