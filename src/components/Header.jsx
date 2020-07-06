import React from 'react';
import { HomeFilled } from '@ant-design/icons';
import {
  PageHeader, Button
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/user';


const Header = (props) => {
  const history = useHistory();

  const toHome = () => {history.push('/')};

  const { login, username, logout } = props;
  const buttonsLayout = login
    ? [(<Button key={3} onClick={logout}>
    Log Out
      </Button>), (<Button onClick={() => history.push('/addarticle')} key={4}>
        Add Article
      </Button>)]
    : [(
      <Button key={1} onClick={() => history.push('/signup')}>
                    Sign Up
                </Button>
    ),
    (
      <Button key={2} onClick={() => history.push('/login')}>
        Sign In
      </Button>
    )]
  return (
    <div>
      <PageHeader
        backIcon={<HomeFilled />}
        onBack={toHome}
        title="Blog platform"
        subTitle={username ? 'You logged in as ' + username : ''}
        extra ={buttonsLayout}
      >
        
      </PageHeader>
    </div>
  );
};

const mapStateToProps = ({ userReducers }) => {
  const { loggedIn, user } = userReducers.userState;
  if (loggedIn) {
    return {
      username: user.username, login: true,
    };
  }
  return {
    login: false,
  };
};

const actionsToProps = {
  logout: actions.LogOut,
}

Header.defaultProps = {
    login: false,
    userName: '',
};

Header.propTypes = {
    login: PropTypes.bool,
    userName: PropTypes.string,
};

export default connect(mapStateToProps, actionsToProps)(Header);
