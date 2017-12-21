'use strict'
var ImageRekognition = require('./Service.js');

exports.handler = (event, context, callback) => {
	
	console.log("Event -- ", event);
	
	var error;
	var imgFileName;
	if(event.path != undefined){
		error = "Invalid path, Path must be /rekognition." + event.headers + event.pathParameters
		context.succeed({
			'statusCode': 400,
			'headers': {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers' : "*",
				'Access-Control-Allow-Credentials':true
			},
			'body': JSON.stringify(error)
		});
	}else{
		var bucketName = process.env.bucketname;
		var folderName = process.env.foldername;
		console.log("backetName :", bucketName,"folderName :", folderName);
		console.log("Test -- ", process.env.test);
		if(bucketName == '' || folderName == ''){
			error = 'bucketName or folderName is not found.'
			context.succeed({
				'statusCode': 400,
				'headers': {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Headers' : "*",
					'Access-Control-Allow-Credentials':true
				},
				'body': JSON.stringify(error)
			});
		}else{
			if (event !== null && event !== undefined) {
				let postData = JSON.parse(JSON.stringify(event))
				imgFileName = postData[0].imgFileName;
				console.log("image name from param: " + imgFileName)
				
				var imageRekognition = new ImageRekognition(bucketName,imgFileName);
				imageRekognition.startService().then(function(data){
					console.log(" Get success response from [startService] -- ");
					context.succeed({
						'statusCode': 200,
						'headers': {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Headers' : "*",
							'Access-Control-Allow-Credentials':true
						},
						'body': JSON.stringify(data)
					});
				}.bind(this), function(err){
					console.log(" Get error response from [startService] -- ");
					context.succeed({
						'statusCode': 400,
						'headers': {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Headers' : "*",
							'Access-Control-Allow-Credentials':true
						},
						'body': JSON.stringify(err)
					});
				}.bind(this)); 
			 }
			 else
			 {
				 error = 'Image file name is not found.'
				 console.log(" image name is not posted -- ");
					context.succeed({
						'statusCode': 400,
						'headers': {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Headers' : "*",
							'Access-Control-Allow-Credentials':true
						},
						'body': JSON.stringify(error)
					});
			 }
			
		}
	}
};