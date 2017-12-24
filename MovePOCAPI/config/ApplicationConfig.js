class ApplicationConfig {
    constructor() {
        init();
    }
}

const init = () => {
    const globalVariables = {
        apiVersion: 'v1.0',
        serverPort: 2001,
        region: '',
        accessKeyId: '',
        secretAccessKey: '',
        s3BucketImgFolder: '/images/',
        lambdaImageRekognition: 'move-rekognition'
    };

    const config = Object.assign({}, ENV, globalVariables);
    setGlobals('APPLICATIONCONFIG', config);
};

module.exports = new ApplicationConfig();
