import React, { useState, useEffect } from 'react';
import {
  Button, Card, Tag,
} from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { differenceInMilliseconds, formatDuration } from 'date-fns';
import * as actions from '../actions/index';
import { connect } from 'react-redux';
import {
  useLocation, useParams
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
  const { status, getArticle, article, loggedIn, favoriteControl, favState } = props;
  const { slug } = useParams()
  const likeControl = () => (e) => {
    e.preventDefault();
    if (!loggedIn) {
      alert('need to loign');
      return;
    }
    favoriteControl(article.slug, article.favorited);
  };

  switch (status) {
    case 'none':
      getArticle(slug)
      return (<div>Wait a bit</div>)
    case 'requested':
      return (<div>A bit more</div>)
    case 'success' :
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
        <Button type="text" onClick={likeControl()} disabled={ favState === 'requested'}>
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

const mapStateToProps = ({ userState, articlesList, ArticleFetchingState, favoriteControlState }) => {

  const status = ArticleFetchingState;
  const { article, favoritedSlugs } = articlesList;
  const loggedIn = userState.status === 'success' ? true : false;
  
  if (status === 'success') {
    if (loggedIn) {
      const favorited = favoritedSlugs.includes(article.slug)
      return {
        status, article: {...article, favorited}, loggedIn, favState: favoriteControlState,
      };
    }
    return {
      status, article, loggedIn, favState: favoriteControlState,
    };
  }
  return {
    status, article: {}, loggedIn
  };
};


export default connect(mapStateToProps, actionCreators)(SingleArticle);

