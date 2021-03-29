import React, { useEffect } from 'react';
import axios from 'axios';

/** Poll backend's keep-alive route every 5 minutes to maintain Shibboleth session. */
export default () => {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/keepalive'
      : `${process.env.PUBLIC_URL}/keepalive`;

  useEffect(() => {
    const interval = setInterval(() => axios.get(url), 5 * 60 * 1000);
    return () => clearInterval(interval);
  });

  return <div />;
};
