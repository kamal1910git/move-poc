import React, {Component} from 'react';
import {bindAll} from 'lodash';
import $ from 'jquery';
import { moveConfig } from '../config.js';
import ItemLister from '../components/ItemLister';
const fetch = require("isomorphic-fetch");

class ImageUploader extends React.Component {

  constructor() {
    super();
    this.state = {
      data_uri: null,
      processing: false,
      info:false,
      infotype:false,
      sampledata: '{"images/house-interior-img1.jpeg":[{"Name":"Bench","Confidence":99.03282165527344},{"Name":"Indoors","Confidence":90.77249145507812},{"Name":"Room","Confidence":90.77249145507812},{"Name":"Interior Design","Confidence":75.31472778320312},{"Name":"Coffee Table","Confidence":74.56694793701172},{"Name":"Furniture","Confidence":74.56694793701172},{"Name":"Table","Confidence":74.56694793701172},{"Name":"Chair","Confidence":72.17008209228516}]}'
    } 
    bindAll(this, 'handleFile', 'handleSubmit');
  }

  handleSubmit(e) {
    e.preventDefault();
    const _this = this;

    if(_this.state.data_uri == null)
    {
      this.setState({
        info: true,
        processing: false
      });
    }
    else
    {
      this.setState({
        info: false,
        processing: true,
        infotype: false       
      });
    }

    if(_this.state.data_uri != null)
    {
      console.log("call started to : " + moveConfig.apiImageUploaderPostUrl);

      const promise = $.ajax({
        url: moveConfig.apiImageUploaderPostUrl,
        type: "POST",
        data: {
          data_uri: this.state.data_uri,
          filename: this.state.filename,
          filetype: this.state.filetype
        },
        dataType: 'json'
      });

      promise.done(function(data){
        _this.setState({
          processing: false,
          uploaded_uri: data.uri
        });
      });
    }

  }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    
    this.setState({
      info:false,
      uploaded_uri: null,
      detectedlabel: null,
      infotype:false
    });
    
    if(file.type == 'image/jpeg' || file.type == 'image/jpg')
    {
      reader.onload = (upload) => {
        this.setState({
          data_uri: upload.target.result,
          filename: file.name,
          filetype: file.type
        });
      };

      reader.readAsDataURL(file);
    }
    else
    {
      this.setState({
        infotype:true
      });
    }
  }

  processImage = () => {
    var imageFilename = [];
    imageFilename.push({
      imgFileName: this.state.uploaded_uri.split('/').pop()
    });
    console.log("image file name:" + JSON.stringify(imageFilename));
    fetch(moveConfig.apiImageProcessingLambdaPostUrl, {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      body: JSON.stringify(imageFilename),
    }) 
      .then(res => res.json())
      .then(data => {
          this.setState({ detectedlabel: data.data.body });         
      });
      
  }
  

  render() {
    let processing;
    let uploaded;
    let info;
    let infotype;

    if (this.state.uploaded_uri) {
      uploaded = (
        <div className='row'>
        <div className='col-sm-12'>
          <h4>Image uploaded!</h4>
          <img style={{boder:'2px'}} className='image-preview' src={this.state.uploaded_uri} />
          <p>Image location: <a target="_blank" href={this.state.uploaded_uri}>{this.state.uploaded_uri}</a></p>
          <p style={{marginTop:"40px"}}>Process the uploaded Image: <button className="button" onClick={this.processImage}>Process</button></p><br /><br/>
          <ItemLister imagename={this.state.uploaded_uri} detectedlabel={this.state.detectedlabel}/>          
        </div>
        </div>
      );
    }
    if (this.state.info) {
      info = "Please select the image."
    }

    if (this.state.infotype) {
      info = "Please select only .jpg/.jpeg image."
    }

    if (this.state.processing) {
      processing = "Uploading image... please wait...";
    }
        
    return (
      <div className='row'>
        <div className='col-sm-12'>        
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <p>Select image to process(.jpg/.jpeg): </p><p style={{color:'red'}}>{infotype}</p><p style={{color:'red'}}>{info}</p>
            <input type="file" accept=".jpg,.jpeg" onChange={this.handleFile} />
            <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
            <p>{processing}</p>
          </form>
          {uploaded}
        </div>
      </div>
    );
  }
}

export default ImageUploader;