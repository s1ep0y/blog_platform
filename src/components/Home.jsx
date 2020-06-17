import React, {useEffect} from 'react';
import {
  Button
} from 'antd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

const Home = (props) => {
  const history = useHistory();

  const { login, user,  logOut} = props;

  useEffect(()=> {
    if(!login) history.push('/signin');
  })
  console.log(user)
  return(
  <div>
    <p>
        {user.username}
    </p>
    <Button onClick={logOut}>
          Sign Out
        </Button>
  </div>
)};

const actionCreators = {
    logOut: actions.logOut
};

const mapStateToProps = ({userState}) => {
    const {status, user} = userState;
    if (status === 'success') return {user, login: true};
    return ({ login: false, user: '' })
};

export default connect(mapStateToProps, actionCreators)(Home);