import React, { Component } from "react";
import GoogleMaps from './containers/GoogleMaps';

class GoogleMap extends React.Component {
 render() {
   return (
    <div>
     <div>
       <h2>Move - Map Cluster</h2><br/>
       <GoogleMaps />
     </div>
     <div style={{paddingTop:'20px', float:'right'}}>
     <h4>Developed by: <img className='h4img' src='logo.png'/></h4>
     </div>
     </div>
   );
 }
}

export default GoogleMap