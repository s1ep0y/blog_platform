import React from 'react';
import { useFormik } from 'formik';
import { uniqueId } from 'lodash';
import {
  Form, Input, Button,
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';

const SignUp = (props) => {
  const history = useHistory();
  const { status, resErrors, register } = props;
  const redirectToLogin = () => {
    history.push('/login');
  };

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

  const msg = () => {
    if (status === '') {
      return null;
    }
    if (status === 'success') {
      return (
        <p className="successText">
          You register in succesfull, you be redirect to sign in page
          {' '}
          <br />
          If you arent,
          {' '}
          <Link to="/login">click here</Link>
        </p>
      );
    }
    return (
      <ul className="errorText">
        { Object.entries(resErrors).map(([errKey, value]) => (
          <li key={uniqueId()}>
            {errKey}
            {' '}

            {value}
          </li>
        ))}
      </ul>
    );
  };

  const signUpForm = () => {
    const { errors, touched, handleSubmit } = formik;
    return (
      <div className="wrapper">
        <Button onClick={redirectToLogin}>
          Sign In
        </Button>
        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="username"
            className="requred"
            validateStatus={errors.name && touched.name
              ? 'error'
              : 'success'}
            help={errors.name && touched.name
              ? errors.name
              : null}

          >

            <Input onBlur={formik.handleBlur} onChange={formik.handleChange} />

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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>

        {msg()}
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

const mapStateToProps = ({ signUpState }) => {
  const { status } = signUpState;
  if (status === 'fail') return { status, resErrors: signUpState.errors };
  return { status };
};

SignUp.defaultProps = {
  status: '',
  resErrors: {},
  register: () => {},
};

SignUp.propTypes = {
  status: PropTypes.string,
  resErrors: PropTypes.objectOf(PropTypes.any),
  register: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(SignUp);
