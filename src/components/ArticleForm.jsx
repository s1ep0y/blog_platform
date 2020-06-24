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
  const { postArticle, loggedIn, username, action, article, errors, getArticle } = props;
  const [updatePage, setUpdatePage] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loggedIn) history.push('/loggedIn');
    if(!updatePage){
    if(pathname.includes('/editarticle/')) {
      setUpdatePage(true);
      if(article.slug !== slug) {
        getArticle(slug)
        return;
      }
      if(article.author.username !== username) {
        if (!loggedIn) history.push('/');
      };
      // form.resetFields();
    };
  }
  if(updatePage) form.setFieldsValue(initialValues);
  });



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

  
  const initialValues = updatePage ? {title: article.body,
    description: article.description,
    body: article.body,}
    :  { title: '', description: '', body: ''}

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
          <Input value={JSON.stringify(formik.values)} onChange={formik.handleChange} onBlur={formik.handleBlur} />
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

const mapStateToProps = ({ userState, articlesList }) => {
  const { article, errors } = articlesList;
  const { loggedIn, user } = userState;
  if (loggedIn) return { username: user.username, loggedIn, article, errors };
  return ({ loggedIn });
};

AddArticle.defaultProps = {
  user: {},
};

AddArticle.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};


export default connect(mapStateToProps, actionCreators)(AddArticle);
