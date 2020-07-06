import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Tag,
} from 'antd';
import { uniqueId } from 'lodash';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/articles';
import FormMessage from './FormMessage';

const AddArticle = (props) => {
  const {
    postArticle,
    dropSendedState,
    sendedState,
    loggedIn,
    updateArticle,
    username,
    article,
    errors,
    getArticle,
    ArticleFetchingState,
    updateArticleFetchingState,
    PostArticleFetchingState,
  } = props;
  const [tagList, setTags] = useState([]);
  const [updated, setUpdatedState] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [form] = Form.useForm();

  if (!loggedIn) {
    history.push('/login');
  }

  const valShemaPost = Yup
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

  const valShemaEdit = Yup
    .object()
    .shape({ title: Yup.string(), description: Yup.string(), body: Yup.string() });

  const page = pathname.includes('/editarticle/')
    ? 'edit'
    : 'post';
  const status = page === 'edit'
    ? updateArticleFetchingState
    : PostArticleFetchingState;

  const initialValues = page === 'edit' && loggedIn
    ? {
      title: article.title,
      description: article.description,
      body: article.body,
      tag: '',
    }
    : {
      title: '',
      description: '',
      body: '',
      tag: '',
    };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: page === 'edit'
      ? valShemaEdit
      : valShemaPost,
    onSubmit: async (values) => {
      const articleToSend = {
        ...values,
        tagList,
      };
      if (page === 'post') {
        postArticle(articleToSend);
      } else {
        updateArticle(articleToSend, slug);
      }
    },
  });
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      dropSendedState();
    }
    if (status === 'finished' && sendedState) {
      history.push(`/articles/${article.slug}`);
    }
  }, [
    loaded,
    status,
    sendedState,
    dropSendedState,
    history,
    article.slug,
  ]);

  if (page === 'edit') {
    if (!loggedIn) {
      history.push('/login');
      return null;
    }
    if (ArticleFetchingState === 'requested') {
      return <p>wait for download</p>;
    }
    if (!updated) {
      if (article.slug !== slug) {
        getArticle(slug);
        return <p>wait for slug</p>;
      }
      setUpdatedState(true);
    }
    if (article.author.username !== username) {
      history.push('/');
    }
    if (article.tagList.length !== 0 && tagList.length === 0) {
      setTags(article.tagList);
      article.tagList = [];
    }
  }

  const addTagToList = (event) => {
    event.preventDefault();
    if (formik.values.tag.length === 0) {
      return;
    }
    setTags([
      ...tagList,
      formik.values.tag,
    ]);
    formik.setFieldValue('tag', '');
    form.setFieldsValue({ tag: '' });
  };

  const removeTagFromList = (val) => (event) => {
    event.preventDefault();
    setTags(tagList.filter((elem) => elem !== val));
  };
  return (
    <div className="wrapper">
      <Form onFinish={formik.handleSubmit} initialValues={initialValues} form={form}>
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

        <Form.Item label="Add tag" name="tag">
          <Input
            allowClear="allowClear"
            value={formik.values.tag}
            onChange={formik.handleChange}
            onPressEnter={addTagToList}
            style={{
              marginBottom: '24px',
            }}
          />

        </Form.Item>
        <div>
          {
                        tagList.map((text) => (
                          <Tag key={uniqueId()} closable="closable" onClose={removeTagFromList(text)}>
                            {text}
                          </Tag>
                        ))
                    }
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {
                            page === 'edit'
                              ? 'Save Changes'
                              : 'Post Article'
                        }
          </Button>
        </Form.Item>
      </Form>
      {FormMessage(status, errors)}
    </div>
  );
};

const actionCreators = {
  postArticle: actions.postArticle,
  getArticle: actions.getArticle,
  updateArticle: actions.updateArticle,
  dropSendedState: actions.dropSendedState,
};

const mapStateToProps = ({
  userReducers,
  articleReducers: {
    articlesState,
    sendedState,
    ArticleFetchingState,
    updateArticleFetchingState,
    PostArticleFetchingState,
  },
}) => {
  const { article, errors } = articlesState;
  const { loggedIn, user } = userReducers.userState;
  if (loggedIn) {
    return {
      sendedState,
      username: user.username,
      loggedIn,
      article,
      errors,
      ArticleFetchingState,
      updateArticleFetchingState,
      PostArticleFetchingState,
    };
  }
  return ({ loggedIn });
};

AddArticle.defaultProps = {
  postArticle: {},
  dropSendedState: () => {},
  sendedState: false,
  loggedIn: false,
  updateArticle: false,
  username: '',
  article: {},
  errors: {},
  getArticle: () => {},
  ArticleFetchingState: '',
  updateArticleFetchingState: '',
  PostArticleFetchingState: '',
};

AddArticle.propTypes = {
  postArticle: PropTypes.func,
  dropSendedState: PropTypes.func,
  sendedState: PropTypes.bool,
  loggedIn: PropTypes.bool,
  updateArticle: PropTypes.bool,
  username: PropTypes.string,
  article: PropTypes.objectOf(PropTypes.any),
  errors: PropTypes.objectOf(PropTypes.any),
  getArticle: PropTypes.func,
  ArticleFetchingState: PropTypes.string,
  updateArticleFetchingState: PropTypes.string,
  PostArticleFetchingState: PropTypes.string,
};

export default connect(mapStateToProps, actionCreators)(AddArticle);
