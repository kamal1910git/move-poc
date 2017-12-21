import React, { Component } from "react";

class Home extends React.Component {
 render() {
   return (
     <div>
     <div className='div-background' >
       <h2>Move</h2>
       <h3>Image Recognition</h3>       
       <p>We can dentify the objects, people, text, scenes, and activities, as well as detect any inappropriate content.</p>          
       <img src='image-recognition.png' className="imgSize" />
       <h3>Map Cluster</h3>       
       <p>MapCluster collects markers into different clusters and displays the number of markers in each cluster with a label, creating new clusters as the map zoom level changes.</p>
       <img src='clusterereffect.png' className="imgSize" />       
     </div>
     <div style={{paddingTop:'20px', float:'right'}}>
     <h4>Developed by: <img className='h4img' src='logo.png'/></h4>
     </div>
     </div>
   );
 }
}

export default Home