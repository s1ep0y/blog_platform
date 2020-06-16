import React from 'react';
import { useFormik } from 'formik';
import {
  Form, Input, Button, message,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const SignIn = (props) => {
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
      const { login } = props;
      login(valsPrepared);
    },
  });

  const msg = () => {
    const { success, resErrors } = props;
    if (!props.hasOwnProperty('success')) {
      return null;
    }
    if (success) {
      return (
        <p>
          Login in succesfull (later here will be redirect to index)
        </p>
      );
    }
    return (
      <ul>
        { Object.entries(resErrors).map(([key, value]) => (
          <li>
            {key}
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
      <div>
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
        <Button onClick={redirectToLogin}>
          Sign Up
        </Button>
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

const mapStateToProps = ({ signInState }) => {
  const { status } = signInState;
  switch (status) {
    case 'success': {
      return {
        success: true,
      };
    }
    case 'fail': {
      return {
        success: false,
        resErrors: signInState.errors,
      };
    }

    default:
      return {

      };
  }
};

export default connect(mapStateToProps, actionCreators)(SignIn);
