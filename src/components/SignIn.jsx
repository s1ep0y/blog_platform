import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { useFormik } from 'formik';
import {
  Form, Input, Button,
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const SignIn = (props) => {
  const { status, resErrors, login } = props;

  const history = useHistory();
  const redirectToLogin = () => {
    history.push('/signup');
  };

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

  const msg = () => {
    if (status === '') {
      return null;
    }
    if (status === 'success') {
      setTimeout(() => {
        history.push('/');
      }, 2000);
      return (
        <p className="successText">
          Login in succesfull, you will be redirect to index
          {' '}
          <br />
          If you arent,
          {' '}
          <Link to="/">click here</Link>
        </p>
      );
    }
    return (
      <ul className="errorText">
        { Object.entries(resErrors).map(([errKey, value]) => (
          <li key={uniqueId()}>
            {errKey}
            {' '}
            :
            {value}
          </li>
        ))}
      </ul>
    );
  };

  const loginForm = () => {
    const { errors, touched, handleSubmit } = formik;
    return (
      <div className="wrapper">
        <Button onClick={redirectToLogin}>
          Sign Up
        </Button>
        <Form onFinish={handleSubmit}>

          <Form.Item
            name="email"
            label="Email"
            className="requred"
            validateStatus={errors.email && touched.email
              ? 'error'
              : 'success'}
            help={errors.email && touched.email
              ? errors.email
              : null}
          >
            <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className="requred"
            validateStatus={errors.password && touched.password
              ? 'error'
              : 'success'}
            help={errors.password && touched.password
              ? errors.password
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
        {msg()}
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

const mapStateToProps = ({ userState }) => {
  const { status } = userState;
  if (status === 'fail') return { status, resErrors: userState.errors };
  return { status };
};

SignIn.defaultProps = {
  status: '',
  resErrors: {},
  login: () => {},
};

SignIn.propTypes = {
  status: PropTypes.string,
  resErrors: PropTypes.objectOf(PropTypes.any),
  login: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(SignIn);
