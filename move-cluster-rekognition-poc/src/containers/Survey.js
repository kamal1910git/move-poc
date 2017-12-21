import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';

import InlineError from './messages/InlineError';
import mySeoMatcher from '../utils/mySeoMatcher';
import ResultPage from './pages/ResultPage';

class Survey extends React.Component {
  state = {
    data: {
      participantName: '',
      title: '',
      description: ''
    },
    loading: false,
    errors: {},
    val: 0,
    shouldRedirect: false
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      const val = this.calculate(this.state.data);
      console.log(val);
      this.setState({ val: val, loading: false, shouldRedirect: true });
    }
  };

  calculate = data => {
    const title = data.title;
    const description = data.description;

    let titleScore = 0;
    let descriptionScore = 0;

    if (title.length <= 65 && title.length >= 55) {
      titleScore += 10;
    }

    if (
      (title.length < 55 && title.length > 45) ||
      (title.length < 75 && title.length > 65)
    ) {
      titleScore += 7;
    }

    if (
      (title.length < 45 && title.length > 35) ||
      (title.length < 85 && title.length > 75)
    ) {
      titleScore += 3;
    }

    if (title.length < 35 || title.length > 85) {
      titleScore += 0;
    }

    if (description.length <= 165 && description.length >= 135) {
      descriptionScore += 10;
    }

    if (
      (description.length < 135 && description.length > 100) ||
      (description.length < 200 && description.length > 165)
    ) {
      descriptionScore += 7;
    }

    if (
      (description.length < 100 && description.length > 50) ||
      (description.length < 250 && description.length > 200)
    ) {
      descriptionScore += 3;
    }

    if (description.length < 50 || description.length > 250) {
      descriptionScore += 0;
    }

    const splitTitle = title.split(' ');
    const splitDescription = description.split(' ');

    const appropriateSeoList = mySeoMatcher[0][this.props.rand];

    for (let word of splitTitle) {
      if (appropriateSeoList.includes(word.toLowerCase())) {
        titleScore += 10;
      }
    }

    for (let word of splitDescription) {
      if (appropriateSeoList.includes(word.toLowerCase())) {
        descriptionScore += 5;
      }
    }

    return {
      titleScore,
      descriptionScore
    };
  };

  validate = data => {
    const errors = {};
    if (!data.participantName) {
      errors.participantName = "Can't be blank";
    }

    if (!data.title) {
      errors.title = "Can't be blank";
    }

    if (!data.description) {
      errors.description = "Can't be blank";
    }

    return errors;
  };

  render() {
    const { data, errors, loading, shouldRedirect } = this.state;

    if (shouldRedirect === true) {
      return <ResultPage val={this.state.val} />;
    } else {
      return (
        <div>
          <h5 className="ui center aligned header">
            Please enter your details to get started
          </h5>
          <Form onSubmit={this.onSubmit} loading={loading}>
            {errors.message && (
              <Message negative>
                <Message.Header>Something went wrong</Message.Header>
                <p>{errors.message}</p>
              </Message>
            )}

            <Form.Field
              className="div-form-field"
              error={!!errors.participantName}
            >
              <p>
                <label htmlFor="participantName">Please enter your name</label>
              </p>
              <input
                type="text"
                id="participantName"
                name="participantName"
                placeholder="John Doe"
                autoComplete="off"
                autoFocus="true"
                value={data.participantName}
                onChange={this.onChange}
              />
              {errors.participantName && (
                <InlineError text={errors.participantName} />
              )}
            </Form.Field>

            <Form.Field className="div-form-field" error={!!errors.title}>
              <p>
                <label htmlFor="title">Please enter the title</label>
              </p>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="My awesome title Ex: Real Estate, Apartments, Mortgages & Home Values"
                autoComplete="off"
                value={data.title}
                onChange={this.onChange}
              />
              {errors.title && <InlineError text={errors.title} />}
            </Form.Field>

            <Form.Field className="div-form-field" error={!!errors.description}>
              <p>
                <label htmlFor="description">
                  Please enter the description
                </label>
              </p>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="My awesome description"
                autoComplete="off"
                value={data.description}
                onChange={this.onChange}
              />
              {errors.description && <InlineError text={errors.description} />}
            </Form.Field>
            <Button className="button">Submit</Button>
          </Form>
        </div>
      );
    }
  }
}

export default Survey;