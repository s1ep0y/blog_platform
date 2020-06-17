import React, { useEffect } from 'react';
import {
  Button,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/index';

const Home = (props) => {
  const history = useHistory();

  const { login, user, logOut } = props;

  useEffect(() => {
    if (!login) history.push('/login');
  });
  return (
    <div className="wrapper">
      <Button onClick={logOut}>
        Sign Out
      </Button>
      <p>
        Name:
        {' '}
        {user.username}
      </p>
    </div>
  );
};

const actionCreators = {
  logOut: actions.logOut,
};

const mapStateToProps = ({ userState }) => {
  const { status, user } = userState;
  if (status === 'success') return { user, login: true };
  return ({ login: false, user: {} });
};

Home.defaultProps = {
  login: false,
  user: {},
  logOut: () => {},
};

Home.propTypes = {
  login: PropTypes.bool,
  user: PropTypes.objectOf(PropTypes.any),
  logOut: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Home);
