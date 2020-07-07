import React from 'react';
import {
  Button, Tag,
} from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

const dateDistance = (date) => formatDistanceToNow(new Date(date));


const ArticleListItem = (props) => {
  const {
    title, author, date, tags, likes, likeByUser, likeControl, body,
  } = props;
  dateDistance(date);
  return (
    <div className="article_list_item">

      <div className="article_list_item__header">
        <p className="article_list_item__posted">
          Posted
          {' '}
          {dateDistance(date)}
          {' '}
          ago
        </p>
        <h3 className="article_list_item__title">{title}</h3>
        <p className="article_list_item__author">
          By{' '}
          {author}
        </p>
      </div>


      <p className="article_list_item__body">{body}</p>


      <div className="article_list_item__tags">
        {
                tags.map((text) => (
                  <Tag key={uniqueId()}>
                    {text}
                  </Tag>
                ))
            }
      </div>

      <Button type="text" onClick={likeControl} className="article_list_item__like_Button">
        <HeartTwoTone style={{ fontSize: 20 }} twoToneColor={likeByUser ? 'lightgreen' : 'lightgrey'} />
        {' '}
        {likes}
      </Button>
    </div>
  );
};

ArticleListItem.defaultProps = {
  title: '',
  author: '',
  date: '',
  tags: [],
  likes: 0,
  likeByUser: false,
  likeControl: () => {},
  body: '',
};

ArticleListItem.propTypes = {
  body: PropTypes.string,
  likeControl: PropTypes.func,
  title: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.any),
  likes: PropTypes.number,
  likeByUser: PropTypes.bool,
};

export default ArticleListItem;
