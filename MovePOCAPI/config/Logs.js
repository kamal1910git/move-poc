const morgan = require('morgan');

module.exports = (app) => {
    // setup the logger 
    process.env.ENV_NAME ? app.use(morgan('combined')) : '';

    process.on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    }).on('uncaughtException', err => {
        logger.error(err, 'Uncaught Exception thrown');
    });
};