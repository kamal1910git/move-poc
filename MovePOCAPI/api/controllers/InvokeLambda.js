var Q = require('q');
var http = require("http")
var aws = require("aws-sdk")

var InvokeLambda = function(options){
    var deferred = Q.defer();
    console.log("in:" + options.postData.imgFileName);
var lambda = new aws.Lambda({
  region: APPLICATIONCONFIG.region,
  accessKeyId: APPLICATIONCONFIG.accessKeyId,
  secretAccessKey: APPLICATIONCONFIG.secretAccessKey
})

var params = {
  FunctionName: APPLICATIONCONFIG.lambdaImageRekognition,
  Payload: JSON.stringify(options.postData.imgFileName)
}

lambda.invoke(params, function(err, data) {
    if (err)
    { 
        deferred.reject(err.stack);
    }
    else
    {
        var output = JSON.parse(data.Payload);
        console.log("data:" + data.Payload);
        deferred.resolve(output);
    }
});

return deferred.promise;

}
module.exports = InvokeLambda;