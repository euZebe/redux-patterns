import { connect } from 'react-redux';
import ArticleForm from './ArticleForm';
import { createArticle } from '../store/articles';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  createForm: (title, body) => dispatch(createArticle(title, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleForm);
