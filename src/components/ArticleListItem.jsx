import React, { useEffect } from 'react';
import {
    Button, Card, Tag
} from 'antd';
import { uniqueId } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { differenceInMilliseconds, formatDuration } from 'date-fns';

const dateDistance = (date) => {
    const diff = differenceInMilliseconds(Date.now(), new Date(date))
    const minutes = Math.floor(diff/60000);
    const hours = Math.floor(minutes/60)%24;
    const days = Math.floor(hours/24);
    return formatDuration({
        days, hours, minutes
    },
    { format: ['days', 'hours', 'minutes']}, { delimiter: '/'})
} 

const ArticleListItem = (props) => {
    const { title, author, date, tags, likes, likeByUser} = props;
    dateDistance(date)
    console.log(tags)
    return(
        <div>
        <Card title={title}>
            <p>{author}</p>
            <p>Posted {dateDistance(date)} ago</p>
            <p>{likes}</p>
            {
                tags.map((text) =>
                    (<Tag key={uniqueId()}>
                        {text}
                    </Tag>)
                )
            }
        </Card>
        </div>
        // <p>123</p>
    )
}

export default ArticleListItem