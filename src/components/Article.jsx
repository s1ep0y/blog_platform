import React, { useEffect, useState } from 'react';
import {
  Button, Tag, message,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { HeartTwoTone } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { connect } from 'react-redux';

import * as actions from '../actions/articles';

const dateDistance = (date) => formatDistanceToNow(new Date(date));

const SingleArticle = (props) => {
  const {
    status,
    getArticle,
    username,
    article,
    loggedIn,
    favoriteControl,
  } = props;
  const { slug } = useParams();
  const [loaded, setLoaded] = useState(false);

  const likeControl = (event) => {
    event.preventDefault();
    if (!loggedIn) {
      message.error('Please login to do it');
      return;
    }
    favoriteControl(article.slug, article.favorited);
  };

  useEffect(() => {
    if (!loaded) {
      getArticle(slug);
      setLoaded(true);
    }
  }, [loaded, getArticle, slug]);

  const EditButton = () => {
    if (username !== article.author.username) {
      return null;
    }
    const preloadArticle = () => getArticle(article.slug);
    return (
      <Link
        to={`/editarticle/${article.slug}`}
        onClick={preloadArticle}
        className="single_article__edit"
      >
        <Button>
          Edit article
        </Button>
      </Link>
    );
  };


  switch (status) {
    case 'none':
      getArticle(slug);
      return (<div>Wait a bit</div>);
    case 'requested':
      return (<div>A bit more</div>);
    case 'finished':
      return (
        <div className="single_article">
          <div className="single_article__header">
            <h2 className="single_article__title">{article.title}</h2>
            <p className="single_article__author">
              By
              {' '}
              {article.author.username}
            </p>
            <p className="single_article__posted">
              Posted
              {' '}
              {dateDistance(article.createdAt)}
              {' '}
              ago
            </p>
            {EditButton()}
            <Button
              type="text"
              onClick={likeControl}
              className="single_article__like_button"
            >
              <HeartTwoTone
                style={{
                  fontSize: 18,
                }}
                twoToneColor={article.favorited
                  ? 'lightgreen'
                  : 'lightgrey'}
              />
              {' '}

              {article.favoritesCount}
            </Button>
          </div>
          <p className="single_article__body">{article.body}</p>


          <div className="single_article__tags">
            {
                            article
                              .tagList
                              .map(
                                (text) => (
                                  <Tag key={uniqueId()}>
                                    {text}
                                  </Tag>
                                ),
                              )
                        }
          </div>
        </div>
      );
    default:
      return (<div>something went wrong</div>);
  }
};

const actionCreators = {
  getArticle: actions.getArticle,
  favoriteControl: actions.favoriteControl,
};

const mapStateToProps = ({
  userReducers,
  articleReducers: {
    articlesState,
    ArticleFetchingState,
  },
}) => {
  const status = ArticleFetchingState;
  const { article } = articlesState;
  const { loggedIn, user } = userReducers.userState;
  if (Object.keys(article).length === 0) {
    return { status: 'none' };
  }
  if (status === 'finished') {
    if (loggedIn) {
      return {
        loggedIn, username: user.username, article, status,
      };
    }
    return { status, article, loggedIn };
  }
  return { status, article: {}, loggedIn };
};

SingleArticle.defaultProps = {
  status: '',
  getArticle: () => {},
  username: '',
  article: {},
  loggedIn: false,
  favoriteControl: () => {},
};

SingleArticle.propTypes = {
  status: PropTypes.string,
  getArticle: PropTypes.func,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,
  favoriteControl: PropTypes.func,
  article: PropTypes.objectOf(PropTypes.any),
};

export default connect(mapStateToProps, actionCreators)(SingleArticle);
