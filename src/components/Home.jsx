import React, { useEffect } from 'react';
import { uniqueId } from 'lodash';
import {
  Button,
} from 'antd';
import { useHistory, Link, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import apiRoutes from '../routes/apiRoutes'
import ArticleListItem from './ArticleListItem'

const Home = (props) => {
  const history = useHistory();

  const { logOut, fetchArticles, articles, allCount, loadedCount } = props;
  

  const addArticle = () => history.push('/addarticle');
    console.log(articles)
  const articlesPrepared = articles.map((item) => (
  <Link to={'/articles/' + item.slug} key = {uniqueId()}>
    <ArticleListItem 
      title={item.title}
      author={item.author.username}
      date={item.createdAt}
      tags={item.tagList}
      likes={item.favoritesCount}
      likeByUser={item.favorited}
    />
  </Link>
  ))
  console.log(articlesPrepared)

  
  return (
    <div className="wrapper">
      <Button onClick={logOut}>
        Sign Out
      </Button>
      <Button onClick={addArticle}>
        Add Article
      </Button>
      {articlesPrepared}
    </div>
  );
};

const actionCreators = {
  logOut: actions.logOut,
  fetchArticles: actions.fetchArticles,
};

const mapStateToProps = ({ articlesList }) => {
  const { articles, allCount, loadedCount } = articlesList;
  return {
    articles, allCount, loadedCount
  }
};

Home.defaultProps = {
  login: false,
  articles: [],
  allCount: 0,
  loadedCount: 0,
  logOut: () => {},
  fetchArticles: () => {},
};

Home.propTypes = {
  articles: PropTypes.array, allCount: PropTypes.number, loadedCount: PropTypes.number,
  logOut: PropTypes.func,
  fetchArticles: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
