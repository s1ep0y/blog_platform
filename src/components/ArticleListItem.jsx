import React from 'react';
import {
  Button, Card, Tag,
} from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { differenceInMilliseconds, formatDuration } from 'date-fns';

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


const ArticleListItem = (props) => {
  const {
    title, author, date, tags, likes, likeByUser, likeControl,
  } = props;
  dateDistance(date);
  return (
    <div>
      <Card title={title}>
        <p>{author}</p>
        <p>
          Posted
          {dateDistance(date)}
          {' '}
          ago
        </p>
        <Button type="text" onClick={likeControl}>
          <HeartTwoTone style={{ fontSize: 18 }} twoToneColor={likeByUser ? 'lightgreen' : 'lightgrey'} />
          {' '}
          {likes}
        </Button>
        {
                tags.map((text) => (
                  <Tag key={uniqueId()}>
                    {text}
                  </Tag>
                ))
            }
      </Card>
    </div>
  );
};

ArticleListItem.defaulProps = {
  title: '', author: '', date: '', tags: [], likes: 0, likeByUser: false, likeControl: () => {},
};

ArticleListItem.propTypes = {
  likeControl: PropTypes.func,
  title: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  tags: PropTypes.array,
  likes: PropTypes.number,
  likeByUser: PropTypes.bool,
};

export default ArticleListItem;
