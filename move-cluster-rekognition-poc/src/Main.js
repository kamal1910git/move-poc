import React, { Component } from "react";

import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import Home from "./Home";
import GoogleMap from "./GoogleMap";
import ImageUpload from "./ImageUpload";
import SeoSurvey from "./SEOSurvey";

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>          
          <ul className="header">
          <li><NavLink exact  to="/">Home</NavLink></li>          
          <li><NavLink to="/ImageUpload">Image Recognition</NavLink></li>
          <li><NavLink to="/MapCluster">Map Cluster</NavLink></li>          
          <li><NavLink to="/SeoSurvey">SEO Survey</NavLink></li> 
          </ul>
          <div className="content">
            <Route exact  path="/" component={Home}/>
            <Route path="/ImageUpload" component={ImageUpload}/>
            <Route path="/MapCluster" component={GoogleMap}/>            
            <Route path="/SeoSurvey" component={SeoSurvey}/>  
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;