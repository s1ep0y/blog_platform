import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button,
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const AddArticle = (props) => {
  const { postArticle, login, user } = props;
  const history = useHistory();
  useEffect(() => {
    if (!login) history.push('/login');
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

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      body: '',
    },
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
      postArticle({
        article: noEmpty,
        token: user.token,
      });
    },

  });

  return (
    <div className="wrapper">
      <Form
        onFinish={formik.handleSubmit}
      >
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
};

const mapStateToProps = ({ userState }) => {
  const { status, user } = userState;
  if (status === 'success') return { user, login: true };
  return ({ login: false, user: {} });
};

AddArticle.defaultProps = {
  user: {},
};

AddArticle.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};


export default connect(mapStateToProps, actionCreators)(AddArticle);
