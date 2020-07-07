import React from 'react';
import { uniqueId } from 'lodash';

const FormMessage = (status, errors) => {
  switch (status) {
    case 'finished':
      return null;

    case 'failed':
      return (
        <ul className="errorText">
          {Object.entries(errors).map(([errKey, value]) => (
            <li key={uniqueId()}>
              {errKey} {value}
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
};

export default FormMessage;
