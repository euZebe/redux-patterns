import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatchSeveralTimes } from '../store/counter';

const ActionDispatchinSeveralTimes = ({ action }) => (
  <div onClick={action}>Dispatch several times</div>
);

ActionDispatchinSeveralTimes.propTypes = {
  action: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  action: dispatchSeveralTimes
};

export default connect(null, mapDispatchToProps)(ActionDispatchinSeveralTimes);