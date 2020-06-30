import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';
import FormMessage from './FormMessage'

const SignIn = (props) => {
  const { status, errors, login, loggedIn } = props;
  const history = useHistory();
  
  if(loggedIn) history.push('/');

  const valShema = Yup
    .object()
    .shape({
      email: Yup
        .string()
        .email('Invalid email')
        .required('Email is required'),
      password: Yup
        .string()
        .required('Please enter your password'),
    });

  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',

    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: valShema,
    onSubmit: async (values) => {
      const valsPrepared = {
        user: values,
      };
      login(valsPrepared);
    },
  });

    const loginForm = () => {
    const { touched, handleSubmit } = formik;
    return (
      <div className="wrapper">
        <Form onFinish={handleSubmit}>

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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        {FormMessage(status, 'Login', errors)}
      </div>
    );
  };

  return (
    <div>{loginForm()}</div>
  );
};

const actionCreators = {
  login: actions.signIn,
};

const mapStateToProps = ({ userState, SignInFetchingState }) => {
  return { status: SignInFetchingState, errors: userState.errors, loggedIn: userState.loggedIn };
  
};

SignIn.defaultProps = {
  status: '',
  errors: {},
  login: () => {},
};

SignIn.propTypes = {
  status: PropTypes.string,
  errors: PropTypes.objectOf(PropTypes.any),
  login: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(SignIn);
