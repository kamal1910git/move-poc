class ApplicationConfig {
    constructor() {
        init();
    }
}

const init = () => {
    const globalVariables = {
        apiVersion: 'v1.0',
        serverPort: 2001,
        region: 'us-east-1',
        accessKeyId: 'AKIAJBIAM5K53T3PYCZQ',
        secretAccessKey: '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',
        s3Bucket: 'move-node-api-dev-serverlessdeploymentbucket-1p9mahp6axnkf',
        s3BucketImgFolder: '/images/',
        lambdaImageRekognition: 'move-rekognition'
    };

    const config = Object.assign({}, ENV, globalVariables);
    setGlobals('APPLICATIONCONFIG', config);
};

module.exports = new ApplicationConfig();