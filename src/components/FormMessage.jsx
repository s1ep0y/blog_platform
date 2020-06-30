import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { useHistory, Link } from 'react-router-dom';

const FormMessage = (status, action, errors) => {
  const history = useHistory();
  switch (status) {
    case 'success':
      setTimeout(() => {
        history.push('/');
      }, 100);
        return (
          <p className="successText">
            {action} in succesfull, you will be redirect to index
            {' '}
            <br />
            If you arent,
            {' '}
            <Link to="/">click here</Link>
          </p>
        );
      
    case 'failed':
      return (
        <ul className="errorText">
          { Object.entries(errors).map(([errKey, value]) => (
            <li key={uniqueId()}>
              {errKey}
              {' '}
              {value}
            </li>
          ))}
        </ul>
      );
  
    default:
      return null
  }
}

FormMessage.defaultProps = {
  errors: {}
};

FormMessage.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  
};

export default FormMessage;