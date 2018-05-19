import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPost } from '../actions';

class PostsNew extends Component {

  renderField(field) {
    const { meta: { touched, error } } = field; // pull meta off of  field  prop, and then nested touched and error from meta
    const className = `form-group ${touched && error ? 'has-danger' : ''}` // conditional to set has-danger if error and touched
    // Still need to wire up to Field parent (using (field) argument)
    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input} // an object that has a bunch of different eventHandlers and props (onChange, onBlur, onFocus, etc.)
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values) {
    // this === component
    console.log(values);
    this.props.createPost(values, () => {
      this.props.history.push('/'); // direct user to root path
    });
  }

  render() {
    // pull off { handleSubmit } property that comes from reduxForm
    // runs the redux side of things through validation - if it's good, then it does the callback this.onSubmit (our code to POST or whatever)
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Field // does not know how to show itself on the screen, only how to interact with Redux Form. component property handles the former.
          name="title" // what the field is being used for (Name, Category, Email, etc.)
          component={this.renderField} // used to display the field - needs a JSX blob
          label="Post Title"
        />
        <Field
          name="categories"
          component={this.renderField}
          label="Categories"
        />
        <Field
          name="content"
          component={this.renderField}
          label="Post Content"
        />
        <button type="submit" className="btn btn-primary">Submit</button>
        <Link to="/" className="btn btn-danger">Cancel</Link>
      </form>
    );
  }
}

function validate(values) { // values is an object that has all the values the user has enter in the form
  // console.log(values) => { title: 'asdf', categories: 'asdfas', content: 'asdfasdf'}

  const errors = {};

  // Validate the inputs from 'values'
  if (!values.title || values.title.length < 3) {
    // the .title below must match the <Field name /> prop in the form above in render()
    errors.title = "Please enter a title that is at least 3 characters!";
  }

  if (!values.categories) {
    errors.categories = "Enter some categories.";
  }

  if (!values.content) {
    errors.content = "Enter some content please.";
  }

  // If errors is empty, the form is fine to submit (if it has *any* properties, redux form assumes form is invalid)
  return errors;
}

// reduxForm works exactly the same as { connect } from 'react-redux'
export default reduxForm({
  validate,
  // This won't share the form state with any other forms generated by this component if it gets a unique string value.
  form: 'PostsNewForm' // Think of "form:" property as the name of the form.
})(
  connect(null, { createPost })(PostsNew)
);
