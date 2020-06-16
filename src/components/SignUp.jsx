import React from 'react';
import { useFormik } from 'formik';
import {
  Form, Input, Button, message,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as actions from '../actions/index';

const SignUp = (props) => {
  const history = useHistory();
  const redirectToLogin = () => {
    history.push('/signin');
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
      const { register } = props;
      register(valsPrepared);
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
          You have been registered (later here will be redirect to login)
        </p>
      );
    }
    return (
      <ul>
        { Object.entries(resErrors).map(([key, value]) => (
          <li>
            {key}
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
      <div>
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
        <Button onClick={redirectToLogin}>
          Sign In
        </Button>
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
  switch (status) {
    case 'success': {
      return {
        success: true,
      };
    }
    case 'fail': {
      return {
        success: false,
        resErrors: signUpState.errors,
      };
    }

    default:
      return {

      };
  }
};

export default connect(mapStateToProps, actionCreators)(SignUp);
