import React from 'react';
import PropTypes from 'prop-types';

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: '5px',
};

const LastUpdates = ({ articles }) => (
  <div style={container}>
    <h2>Last updates</h2>
    {articles.map(a => <div key={a.id}>{a.creationDate.toLocaleString()}: {a.title}</div>)}
  </div>
);

LastUpdates.propTypes = {};

LastUpdates.defaultProps = {};

export default LastUpdates;