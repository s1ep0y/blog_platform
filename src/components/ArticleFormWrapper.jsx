import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/articles';
import ArticleForm from './ArticleForm';

const ArticleFormWrapper = (props) => {
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
  const [updated, setUpdatedState] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { slug } = useParams();


  if (!loggedIn) {
    history.push('/login');
  }

  const page = pathname.includes('/editarticle/')
    ? 'edit'
    : 'post';


  const handlePost = (obj) => {
    postArticle(obj);
  };

  const handleUpdate = (obj) => {
    updateArticle(obj, article.slug);
  };

  const formBaseProps = page === 'edit'
    ? {
      initialValues: {
        title: article.title,
        description: article.description,
        body: article.body,
        tag: '',
      },
      status: updateArticleFetchingState,
      validationSchema: Yup
        .object()
        .shape({ title: Yup.string(), description: Yup.string(), body: Yup.string() }),
      action: handleUpdate,
      tags: article.tagList,
    }
    : {
      initialValues: {
        title: '',
        description: '',
        body: '',
        tag: '',
      },
      status: PostArticleFetchingState,
      validationSchema: Yup
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
        }),
      action: handlePost,
      tags: [],
    };

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      dropSendedState();
    }
    if (formBaseProps.status === 'finished' && sendedState) {
      setLoaded(false);
      history.push(`/articles/${article.slug}`);
      dropSendedState();
    }
  }, [
    loaded,
    sendedState,
    dropSendedState,
    history,
    article.slug,
    formBaseProps,
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
  }
  return (
    <ArticleForm
      action={formBaseProps.action}
      initialValues={formBaseProps.initialValues}
      validationSchema={formBaseProps.validationSchema}
      setSendStatus={setUpdatedState}
      tags={formBaseProps.tags}
      errors={errors}
      page={page}
    />
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
  articleReducers,
}) => {
  const {
    articlesState,
    sendedState,
    ArticleFetchingState,
    updateArticleFetchingState,
    PostArticleFetchingState,
  } = articleReducers;
  const { loggedIn, user } = userReducers.userState;
  if (loggedIn) {
    return {
      sendedState,
      username: user.username,
      loggedIn,
      article: articlesState.article,
      errors: articlesState.errors,
      ArticleFetchingState,
      updateArticleFetchingState,
      PostArticleFetchingState,
    };
  }
  return ({ loggedIn });
};

ArticleFormWrapper.defaultProps = {
  postArticle: {},
  dropSendedState: () => {},
  sendedState: false,
  loggedIn: false,
  updateArticle: () => {},
  username: '',
  article: {},
  errors: {},
  getArticle: () => {},
  ArticleFetchingState: '',
  updateArticleFetchingState: '',
  PostArticleFetchingState: '',
};

ArticleFormWrapper.propTypes = {
  postArticle: PropTypes.func,
  dropSendedState: PropTypes.func,
  sendedState: PropTypes.bool,
  loggedIn: PropTypes.bool,
  updateArticle: PropTypes.func,
  username: PropTypes.string,
  article: PropTypes.objectOf(PropTypes.any),
  errors: PropTypes.objectOf(PropTypes.any),
  getArticle: PropTypes.func,
  ArticleFetchingState: PropTypes.string,
  updateArticleFetchingState: PropTypes.string,
  PostArticleFetchingState: PropTypes.string,
};

export default connect(mapStateToProps, actionCreators)(ArticleFormWrapper);
