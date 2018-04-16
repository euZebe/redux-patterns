import { connect } from 'react-redux';
import ArticleForm from './ArticleForm';
import { createForm } from '../store/articles';

const mapStateToProps = state => {};

const mapDispatchToProps = (dispatch) => ({
  createForm: (title, body) => dispatch(createForm(title, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleForm);
