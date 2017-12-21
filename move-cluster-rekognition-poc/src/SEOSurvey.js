import React, { Component } from 'react';
import Survey from './containers/Survey';
import SurveyQuestion from './components/SurveyQuestion';
import SurveyQuestionsList from './utils/surveyQuestionsList';

class SEOSurvey extends React.Component {
  render() {
    let rand = Math.floor(Math.random() * 4);
    let problem = SurveyQuestionsList[0][rand];
    return (
      <div>
        <div className="div-up-background" style={{ height: '500px' }}>
          <h2>Move - SEO Survey</h2>
          <br />
          <div className="ui hidden divider" />
          <p><SurveyQuestion problem={problem} /></p>
          <Survey rand={rand} />
        </div>
        <div style={{ paddingTop: '20px', float: 'right' }}>
          <h4>
            Developed with &hearts; by:{' '}
            <img className="h4img" src="logo.png" alt="Brillio" />
          </h4>
        </div>
      </div>
    );
  }
}

export default SEOSurvey;