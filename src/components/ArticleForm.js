import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ArticleForm extends React.Component {

  static propTypes = {
    createForm: PropTypes.func.isRequired,
  };

  state = {
    title: '',
    content: '',
  };

  handleChange = (event, newValue) => {
    this.setState({ [event.target.name]: newValue });
  };

  createForm = (e) => {
    e.preventDefault();
    const { createForm } = this.props;
    createForm(this.state.title, this.state.content);
    this.setState({title: '', content: ''});
  };

  render() {
    return (
      <div>
        <h2>new article</h2>
        <TextField name="title" placeholder="title" onChange={this.handleChange} value={this.state.title} />
        <TextField
          multiLine={true}
          rows={2}
          rowsMax={4} fullWidth
          name="content"
          floatingLabelText="content"
          onChange={this.handleChange}
          value={this.state.content}
        />
        <RaisedButton primary onClick={this.createForm} label="add" />
      </div>
    );
  }
}
