import React from 'react';
import JsonTable from 'ts-react-json-table';

class ItemLister extends React.Component {
    constructor() {
    super();
    }
    
    render() {
      console.log(this.props.detectedlabel);
      console.log("imageName:" + this.props.imagename);
      if(this.props.detectedlabel != undefined && this.props.detectedlabel != null)
      {
        var filename='"images/' + this.props.imagename.split('/').pop() + '"';
        console.log(filename);
        filename = this.props.detectedlabel.replace('{'+ filename +':',"");
        console.log(filename);
        filename = filename.substring(0, filename.length-1)
        var dataTbl = JSON.parse(filename);
        dataTbl.forEach(element => {
          element.Confidence = Number(element.Confidence).toFixed(2) + ' %'
        });
        return(        
          <JsonTable rows = {dataTbl} />        
          )
      }
      else
      {
        return (<div>
        <p>{"No data.."}</p>
      </div>);
      }
     }
    } 

    export default ItemLister;