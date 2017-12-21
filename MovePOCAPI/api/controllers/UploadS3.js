var Q = require('q');
var knox = require('knox');

var ImageUploader = function(options){

  var deferred = Q.defer();
  var buf = new Buffer(options.data_uri.replace(/^data:image\/\w+;base64,/, ""),'base64');

  knoxClient = knox.createClient({
    bucket: APPLICATIONCONFIG.s3Bucket
  });

  // put to a path in our bucket, and make readable by the public
  req = knoxClient.put(APPLICATIONCONFIG.s3BucketImgFolder + options.filename, {
   'Content-Length': buf.length,
   'Content-Type': options.filetype,
   'x-amz-acl': 'public-read' 
  });

  req.on('response', function(res) {
    if (res.statusCode === 200) {
      deferred.resolve(req.url);
    } else
      deferred.reject({error: 'true'});
  });

  req.end(buf);
  return deferred.promise;
}

module.exports = ImageUploader;