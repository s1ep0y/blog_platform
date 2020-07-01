import React from 'react';
import { useFormik } from 'formik';
import { uniqueId } from 'lodash';
import {
  Form, Input, Button,
} from 'antd';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import FormMessage from './FormMessage'
import * as actions from '../actions/index';
import { useHistory } from 'react-router';

const SignUp = (props) => {
  const { status, errors, register } = props;
  
  const history = useHistory();
  
  if(status === 'finished') history.push('/');

  const valShema = Yup
    .object()
    .shape({
      username: Yup
        .string()
        .max(20, 'Maximum 50 symbols')
        .required('Please enter your name'),
      email: Yup
        .string()
        .email('Invalid email')
        .required('Email is required'),
      password: Yup
        .string()
        .min(8, 'Password should be at least 8 symbols long')
        .required('Please enter your password'),
    });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      passwordConfrirm: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: valShema,
    onSubmit: async (values) => {
      const valsPrepared = {
        user: values,
      };

      register(valsPrepared);
    },
  });

  

  const signUpForm = () => {
    const {  touched, handleSubmit } = formik;
    return (
      <div className="wrapper">
        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="username"
            className="requred"
            validateStatus={formik.errors.name && touched.name
              ? 'error'
              : 'success'}
            help={formik.errors.name && touched.name
              ? formik.errors.name
              : null}
          >

            <Input onBlur={formik.handleBlur} onChange={formik.handleChange} />

          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            className="requred"
            validateStatus={formik.errors.password && touched.password
              ? 'error'
              : 'success'}
            help={formik.errors.password && touched.password
              ? formik.errors.password
              : null}
          >
            <Input.Password onBlur={formik.handleBlur} onChange={formik.handleChange} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            className="requred"
            validateStatus={formik.errors.email && touched.email
              ? 'error'
              : 'success'}
            help={formik.errors.email && touched.email
              ? formik.errors.email
              : null}
          >
            <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
        {FormMessage(status, 'Sign Up', errors)}
      </div>
    );
  };


  return (
    <div>{signUpForm()}</div>
  );
};

const actionCreators = {
  register: actions.signUp,
};

const mapStateToProps = ({ signUpState, SignUpFetchingState }) => {
  return { status: SignUpFetchingState, errors: signUpState.errors };
};

SignUp.defaultProps = {
  status: '',
  errors: {},
  register: () => {},
};

SignUp.propTypes = {
  status: PropTypes.string,
  errors: PropTypes.objectOf(PropTypes.any),
  register: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(SignUp);
