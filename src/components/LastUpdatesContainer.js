import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LastUpdates from './LastUpdates';
import { getArticlesSortedByCreationDate, getLastModification } from '../store/articles';

const mapStateToProps = createStructuredSelector({
  articles: getArticlesSortedByCreationDate,
  lastModification: getLastModification,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LastUpdates);
