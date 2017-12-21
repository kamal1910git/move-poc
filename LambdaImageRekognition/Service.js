'use strict'
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var Q = require('q');


 AWS.config.apiVersions = {
  rekognition: '2016-06-27',
};

//var rekognition = new AWS.Rekognition({"region" : "us-east-1"});
var rekognition = new AWS.Rekognition();
var bucketName = process.env.bucketname;
var folderName = process.env.foldername;
var imgFileName;

class ImageRekognition{

	constructor(bucketName, imgName){
		console.log(" Object is created -- ");
		imgFileName = folderName + "/" + imgName;	
	}
	
	startService(){
		console.log(" Inside [listBucketObjects] -- ");
		console.log("backetName :", bucketName,"folderName :", folderName);
		
		var defer = Q.defer();
		var params = {
			Bucket: bucketName,			
			Prefix : folderName + "/",
			Delimiter : "/"
		};
		s3.listObjects(params, function(err, data) {
			if (err){
				console.log(err, err.stack);
				return defer.reject("Error on list object, " , err);
			}else{
				console.log(data); 
				var s3ImageObjectList = [];
				data.Contents.forEach(function(item){
					if((item.Key.endsWith(".jpg") || item.Key.endsWith(".jpeg") || item.Key.endsWith(".png"))
						&& item.Key == imgFileName)
					{
						s3ImageObjectList.push(item.Key);
					}
				});
				
				console.log("s3ImageObjectList  -- ", s3ImageObjectList, " Length : ", s3ImageObjectList.length);

				if(s3ImageObjectList.length == 0)
				{
					console.log("File name does not exists in the S3 bucket.");
					return defer.reject("Error on list object, File name does not exists in the S3 bucket.");
				}

				var processedImageObj = {};
				this.processImages(s3ImageObjectList, processedImageObj).then(function(data){
					console.log("Get success response from [processImages]");
					console.log(" processedImageObj -- ", data);

					return defer.resolve(data);
					
					/*this.putObjectIntoS3(data).then(function(outputObject){
						console.log(" Get success response from [putObjectIntoS3] -- ");
						return defer.resolve(outputObject);	
					}.bind(this), function(err){
						console.log(" Get error response from [putObjectIntoS3] -- ");
						return defer.reject(err);
					}.bind(this));*/
					
				}.bind(this), function(err){
					console.log("Get error response from [processImages]");
					return defer.reject(err);
				}.bind(this));
			}
		}.bind(this));
		
		return defer.promise;
	}
	
	processImages(s3ImageObjectList, processedImageObj){
		return Q.promise(function(resolve,reject){
			console.log("Inside [processImage] -- ");
			if(s3ImageObjectList.length > 0){
				var params = {
					Image: {
						S3Object: {
							Bucket: bucketName, 
							Name: s3ImageObjectList[0]
						}
					},
					MaxLabels: 123, 
					MinConfidence: 70
				};
			
				rekognition.detectLabels(params, function(err, data) {
					if (err){
						console.log(err, err.stack); // an error occurred  
						console.log(" Error on detact labels, " , err);
						
						processedImageObj[s3ImageObjectList[0]] = "Error on processing object , " + err;
						
						s3ImageObjectList = s3ImageObjectList.splice(1, s3ImageObjectList.length);
						return resolve(this.processImages(s3ImageObjectList, processedImageObj)); // recursive call
						
					}else{
						processedImageObj[s3ImageObjectList[0]] = data.Labels;
						s3ImageObjectList = s3ImageObjectList.splice(1, s3ImageObjectList.length);
						return resolve(this.processImages(s3ImageObjectList, processedImageObj)); // recursive call
					}
				}.bind(this));
				
			}else{
				resolve(processedImageObj);
			}
		}.bind(this));
	}
	
	putObjectIntoS3(processedImageObj){
		console.log("Inside [putObjectIntoS3] -- ");
		var defer = Q.defer();
		
		var params = {
			Bucket: bucketName,
			Key: "Output/processedImageOutput" + new Date().getTime() + ".json",
			Body: JSON.stringify(processedImageObj, null, 4),
			ACL: 'public-read'
		};
			
		s3.putObject(params, function (err, data) {
			if (err) {
				console.log(" Error on put s3 Object.");
				return defer.reject("Error on put s3 Object, ",err);
			}else{
				var message;
				if(process.env.AWS_REGION != "us-east-1"){
					message	= "Output object is public at  https://s3-"+ process.env.AWS_REGION +".amazonaws.com/" + params.Bucket + "/" + params.Key;
				}else{
					message	= "Output object is public at  https://s3.amazonaws.com/" + params.Bucket + "/" + params.Key;
				}
				
				defer.resolve(message);
			}
		}.bind(this));
		
		return defer.promise;
	}
}

module.exports = ImageRekognition;