import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Tag
} from 'antd';
import { uniqueId } from 'lodash';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';
import FormMessage from './FormMessage'

const AddArticle = (props) => {
  const { postArticle, loggedIn, updateArticle,username, article, errors, getArticle, ArticleFetchingState, updateArticleFetchingState, PostArticleFetchingState } = props;
  const [tagList, setTags] = useState([]);
  const history = useHistory();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [form] = Form.useForm();
  

  if(!loggedIn) {
    history.push('/login');
  }

  const valShema = Yup
    .object()
    .shape({
      title: Yup
        .string()
        .required('Title is required'),
      description: Yup
        .string()
        .required('description is required'),
      body: Yup
        .string()
        .required('Please enter text of article'),
    });

    const page = pathname.includes('/editarticle/') ? 'edit' : 'post'
    const status = page === 'edit' ? updateArticleFetchingState : PostArticleFetchingState
  
  const initialValues = page === 'edit' && loggedIn ? {title: article.title,
    description: article.description,
    body: article.body,
    tag: '',}
    :  { title: '', description: '', body: '', tag: ''}

    // if(updatePage) 

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: valShema,
    onSubmit: async (values) => {
      const articleToSend = {
        ...values, tagList
      }
      if(page === 'post') {
        postArticle(articleToSend);
      } else {
        updateArticle(articleToSend, slug)
      }
    },

  });


  if(page === 'edit') {
    if(!loggedIn) {
      history.push('/login');
      return null;
    }
    if(ArticleFetchingState === 'requested') {
      return <p>wait for download</p>
    }
    if(article.slug !== slug) {
      getArticle(slug);
      return <p>wait for download</p>;
    }
    if(article.author.username !== username) {
      history.push('/')
    }
    if(article.tagList.length !== 0 && tagList.length === 0) {
      setTags(article.tagList)
    }
} 

const addTagToList = e => {
  e.preventDefault();
  if(formik.values.tag.length === 0) {
    return;
  }
    setTags([...tagList, formik.values.tag])
    formik.setFieldValue('tag', '')
    form.setFieldsValue({
      tag: ''
    })
};

const removeTagFromList = (val) => (e) => {
  e.preventDefault()
  setTags(tagList.filter((elem) => elem !== val))
}
  
console.log(tagList)
  return (
    <div className="wrapper">
      <Form
        onFinish={formik.handleSubmit}
        initialValues={initialValues}
        form={form}
       
      >
        {JSON.stringify(formik.values)}
        <Form.Item
          name="title"
          
          label="Title"
          className="required"
          validateStatus={formik.errors.title && formik.touched.title
            ? 'error'
            : 'success'}
          help={formik.errors.title && formik.touched.title
            ? formik.errors.title
            : null}

        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          className="required"

          validateStatus={formik.errors.description && formik.touched.description
            ? 'error'
            : 'success'}
          help={formik.errors.description && formik.touched.description
            ? formik.errors.description
            : null}

        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="body"
          label="Article text"
          className="required"
          validateStatus={formik.errors.body && formik.touched.body
            ? 'error'
            : 'success'}
          help={formik.errors.body && formik.touched.body
            ? formik.errors.body
            : null}
        >
          <Input.TextArea onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>

          <Form.Item
            label="Add tag"
            name="tag"
          >
            <Input
            allowClear
            value={formik.values.tag}
              onChange={formik.handleChange}
              onPressEnter={addTagToList}
              style={{
                marginBottom: '24px',
              }}
            />
            
          </Form.Item>
            <div>{tagList.map((text)=> <Tag key={uniqueId()}
              closable={true} onClose={removeTagFromList(text)}>{text}</Tag>)}</div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {page === 'edit' ? 'Save Changes' : 'Post Article'}
          </Button>
        </Form.Item>
      </Form>
      {FormMessage(status, page, errors)}
    </div>
  );
};

const actionCreators = {
  postArticle: actions.postArticle,
  getArticle: actions.getArticle,
  updateArticle: actions.updateArticle,
};

const mapStateToProps = ({ userState, articlesList, ArticleFetchingState, updateArticleFetchingState, PostArticleFetchingState }) => {
  const { article, errors } = articlesList;
  const { loggedIn, user } = userState;
  if (loggedIn) return { username: user.username, loggedIn, article, errors, ArticleFetchingState, updateArticleFetchingState, PostArticleFetchingState };
  return ({ loggedIn });
};

AddArticle.defaultProps = {
  user: {},
};

AddArticle.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};


export default connect(mapStateToProps, actionCreators)(AddArticle);
