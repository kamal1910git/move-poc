/*export const moveConfig = { apiSearchPropertyInputData: '{"top_left":[-118.494341,34.136797],"bottom_right":[-118.199427,33.97436],"precision":7}', 
                            apiSearchPropertyPostUrl: 'http://localhost:2001/api/v1.0/houseproperty/search',
                            apiImageUploaderPostUrl: 'http://localhost:2001/imageuploader',
                            apiImageProcessingLambdaPostUrl: 'http://localhost:2001/invokeimagelambda' };*/

export const moveConfig = { apiSearchPropertyInputData: '{"top_left":[-118.494341,34.136797],"bottom_right":[-118.199427,33.97436],"precision":7}', 
                            apiSearchPropertyPostUrl: 'http://movepocapi-env.us-east-1.elasticbeanstalk.com/api/v1.0/houseproperty/search',
                            apiSearchPropertyGetUrl: 'http://movepocapi-env.us-east-1.elasticbeanstalk.com/houseproperty',
                            apiImageUploaderPostUrl: 'http://movepocapi-env.us-east-1.elasticbeanstalk.com/imageuploader',
                            apiImageProcessingLambdaPostUrl: 'http://movepocapi-env.us-east-1.elasticbeanstalk.com/invokeimagelambda' };

