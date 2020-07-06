import React from 'react';
import {
  Button, Card, Tag, message
} from 'antd';
import { Link } from 'react-router-dom';
import { HeartTwoTone } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { differenceInMilliseconds, formatDuration } from 'date-fns';
import * as actions from '../actions/articles';
import { connect } from 'react-redux';
import {
  useParams
} from "react-router-dom";

const dateDistance = (date) => {
  const diff = differenceInMilliseconds(Date.now(), new Date(date));
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60) % 24;
  const days = Math.floor(hours / 24);
  return formatDuration({
    days, hours, minutes,
  },
  { format: ['days', 'hours', 'minutes'] }, { delimiter: '/' });
};


const SingleArticle = (props) => {
  const { status, getArticle, username ,article, loggedIn, favoriteControl } = props;
  const { slug } = useParams()
  const likeControl = () => (e) => {
    e.preventDefault();
    if (!loggedIn) {
      message.error('Please login to do it');
      return;
    }
    favoriteControl(article.slug, article.favorited);
  };

  const EditButton = () => {
    if(username !== article.author.username) {
      return null;
    }
    return (
      <Link to={`/editarticle/${article.slug}`} onClick={()=> getArticle(slug)}>
        <Button> Edit article</Button>
      </Link>
    )
  }

  switch (status) {
    case 'none':
      getArticle(slug)
      return (<div>Wait a bit</div>)
    case 'requested':
      return (<div>A bit more</div>)
    case 'finished' :
      return (
        <div>
      <Card title={article.title}>
        <p>{article.author.username}</p>
        <p>
          Posted
          {dateDistance(article.createdAt)}
          {' '}
          ago
        </p>
        <Button type="text" onClick={likeControl()} >
          <HeartTwoTone style={{ fontSize: 18 }} twoToneColor={article.favorited ? 'lightgreen' : 'lightgrey'} />
          {' '}
          {article.favoritesCount}
        </Button>
        {
                article.tagList.map((text) => (
                  <Tag key={uniqueId()}>
                    {text}
                  </Tag>
                ))
            }
      </Card>
      {EditButton()}
    </div>
      )
    default:
      return (<div>something went wrong</div>)
  }
};

const actionCreators = {
  getArticle: actions.getArticle,
  favoriteControl: actions.favoriteControl,
};

const mapStateToProps = ({ userReducers, articleReducers: {articlesList, ArticleFetchingState, favoriteControlState }}) => {

  const status = ArticleFetchingState;
  const { article } = articlesList;
  const { loggedIn, user } = userReducers.userState
  if(Object.keys(article).length === 0) {
    return {status: 'none'}
  }
  if (status === 'finished') {
    if (loggedIn) {
      return {
        loggedIn, username: user.username ,article, status,
      };
    }
    return {
      status, article, loggedIn, 
    };
  }
  return {
    status, article: {}, loggedIn
  };
};

SingleArticle.defaultProps = {
  status: '', getArticle: () => {}, username: '' ,article: {}, loggedIn: false, favoriteControl: () => {},
};

SingleArticle.propTypes = {
  status: PropTypes.string, getArticle: PropTypes.func, username: PropTypes.string , loggedIn: PropTypes.bool, favoriteControl: PropTypes.func, 
  article: PropTypes.objectOf(PropTypes.any),
};

export default connect(mapStateToProps, actionCreators)(SingleArticle);

