import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button,
} from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const AddArticle = (props) => {
  const { postArticle, loggedIn, username, article, errors, getArticle, ArticleFetchingState } = props;
  const [updatePage, setUpdatePage] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [form] = Form.useForm();

  // useEffect(() => {
  //   form.resetFields();
  // })

  console.log(pathname.includes('/editarticle/'))

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

  
  const initialValues = pathname.includes('/editarticle/') ? {title: article.title,
    description: article.description,
    body: article.body,}
    :  { title: '', description: '', body: ''}

    // if(updatePage) 

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: valShema,
    onSubmit: async (values) => {
      const valKeys = Object.keys(values);
      const noEmpty = valKeys.reduce((acc, currentValue) => {
        if (values[currentValue]) {
          const elem = values[currentValue];
          return currentValue.includes('tag') ? { ...acc, tagList: [...acc.tagList, elem] }
            : { ...acc, [currentValue]: elem };
        }
        return { ...acc };
      },
      { tagList: [] });
      postArticle(noEmpty);
    },

  });


  if(pathname.includes('/editarticle/')) {
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
} 
  
// form.setFieldsValue(initialValues);
  return (
    <div className="wrapper">
      <Form
        onFinish={formik.handleSubmit}
        initialValues={initialValues}
        form={form}
      >
        {JSON.stringify(initialValues)}
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
          className="requred"
          validateStatus={formik.errors.body && formik.touched.body
            ? 'error'
            : 'success'}
          help={formik.errors.body && formik.touched.body
            ? formik.errors.body
            : null}
        >
          <Input.TextArea onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item label="Tags">

          <Form.Item
            name="tag_base"
            noStyle="noStyle"
          >
            <Input
              onChange={formik.handleChange}
              style={{
                marginBottom: '24px',
              }}
            />
          </Form.Item>
          <Form.List name="tag">
            {
        (fields, { add }) => (
          <div>
            {
              fields.map((field) => (
                <Form.Item key={field.key}>
                  <Form.Item
                    {...field}
                    style={{ marginBottom: '0px' }}
                  >
                    <Input
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </Form.Item>
              ))
}
            <Form.Item style={{ width: 90 }}>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
              >
                Add field
              </Button>
            </Form.Item>
          </div>
        )
              }
          </Form.List>

        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Article
          </Button>
        </Form.Item>
      </Form>
      {/* {msg()} */}
    </div>
  );
};

const actionCreators = {
  postArticle: actions.postArticle,
  getArticle: actions.getArticle,
};

const mapStateToProps = ({ userState, articlesList, ArticleFetchingState }) => {
  const { article, errors } = articlesList;
  console.log(article)
  const { loggedIn, user } = userState;
  if (loggedIn) return { username: user.username, loggedIn, article, errors, ArticleFetchingState };
  return ({ loggedIn });
};

AddArticle.defaultProps = {
  user: {},
};

AddArticle.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};


export default connect(mapStateToProps, actionCreators)(AddArticle);
