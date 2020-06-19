import React, { useEffect } from 'react';
import {
    Button, Card, Tag
} from 'antd';
import { uniqueId } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ArticleListItem = (props) => {
    const { title, author, date, tags, likes, likeByUser} = props;
    console.log(tags)
    return(
        <div>
        <Card title={title}>
            <p>{author}</p>
            <p>{date}</p>
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