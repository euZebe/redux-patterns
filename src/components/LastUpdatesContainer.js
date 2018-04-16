import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LastUpdates from './LastUpdates';
import { articlesSortedByCreationDate } from '../store/articles';

const mapStateToProps = createStructuredSelector({
  articles: articlesSortedByCreationDate
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LastUpdates);
