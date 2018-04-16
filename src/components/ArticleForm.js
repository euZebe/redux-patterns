import React from 'react';
import PropTypes from 'prop-types';

export default class ArticleForm extends React.Component {

  static propTypes = {
    createForm: PropTypes.func.isRequired,
  };

  createForm = (e) => {
    e.preventDefault();
    const { createForm } = this.props;
    createForm(this.title.value, this.content.value);
    this.title.value = '';
    this.content.value = '';
  };

  render() {
    return (
      <div>
        <h2>new article</h2>
        <input ref={title => this.title = title} placeholder='title' />
        <textarea ref={content => this.content = content} placeholder='content' />
        <button onClick={this.createForm}>add</button>
      </div>
    );
  }
}
