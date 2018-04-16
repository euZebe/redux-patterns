import React from 'react';
import PropTypes from 'prop-types';

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: '5px',
};

const LastUpdates = ({ articles, lastModification }) => (
  <div style={container}>
    <h2>Last updates</h2>
    {articles.map(a => <div key={a.id}>{new Date(a.creationDate).toLocaleString()}: {a.title}</div>)}
    {lastModification && <h6>Last modification: {new Date(lastModification).toLocaleString()}</h6>}
  </div>
);

LastUpdates.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      creationDate: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  )
};

LastUpdates.defaultProps = {};

export default LastUpdates;