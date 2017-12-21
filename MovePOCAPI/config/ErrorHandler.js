class ErrorHandler {
    constructor(app) {
        init(app);
    }
}

const init = (app) => {
    /* common format for all response */
    setGlobals('RESPONSE', {
        error: (message, error, errorType) => {
            if (!message && error.errors) {
                for (const key in error.errors) {
                    message = error.errors[key].message;
                    errorType = error.errors[key].name;
                    break;
                }
            }
            errorType = errorType || error.name;
            return {
                status: 'Error',
                errorType: errorType || 'InternalServerError',
                message
            };
        },
        success: (message, data) => {
            return {
                status: 'Success',
                message,
                data
            };
        }
    });
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error(`${req.method} ${req.path} Not Found.`);
        err.status = 404;
        next(err);
    });


    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });
};


module.exports = new ErrorHandler(app);