import React, { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import {
  Button,
} from 'antd';
import { useHistory, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';
import ArticleListItem from './ArticleListItem'


const Home = (props) => {
  const [loaded, setLoaded] = useState(false)
  const history = useHistory();

  const { logOut, articles, allCount, loadedCount, login ,user, FavoriteControl, fetchArticles } = props;
  console.log(loaded)
  if (!loaded) {
    fetchArticles({}, user.username)
    setLoaded(true)
  }
  

  const likeControl = (...params) => (e) => {
    e.preventDefault();
    if(!login) {
      alert('need to loign')
      return;
    }
    FavoriteControl([...params, user.token])
  }
  const addArticle = () => history.push('/addarticle');
  const articlesPrepared = articles.map((item) => (
  <Link to={'/articles/' + item.slug} key = {uniqueId()}>
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
  ))


  
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
  FavoriteControl: actions.FavoriteControl,
};

const mapStateToProps = ({ articlesList, userState }) => {
  const { articles, allCount, loadedCount } = articlesList;
  const { status, user } = userState;
  if (status === 'success') return { user, login: true, articles, allCount, loadedCount };
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
  FavoriteControl: () => {},
};

Home.propTypes = {
  articles: PropTypes.array, allCount: PropTypes.number, loadedCount: PropTypes.number,
  logOut: PropTypes.func,
  fetchArticles: PropTypes.func,
  FavoriteControl: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
