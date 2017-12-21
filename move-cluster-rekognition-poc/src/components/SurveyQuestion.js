import React from 'react';

class SurveyQuestion extends React.Component {
  render() {
    return <div>{this.props.problem}</div>;
  }
}

export default SurveyQuestion;