import React, { Component } from "react";
import ImageUploader from './containers/ImageUploader';

class ImageUpload extends React.Component {
 render() {
   return (
     <div>
     <div className='div-up-background' style={{height:'100%'}}>
       <h2>Move - Image Recognition</h2><br/>
       <ImageUploader />      
     </div>
     <div style={{paddingTop:'20px', float:'right'}}>
     <h4>Developed by: <img className='h4img' src='logo.png'/></h4>
     </div>
     </div>
   );
 }
}

export default ImageUpload