const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const app = express();

/* --------------------------  Logs   --------------------------------*/
require('./config/Logs')(app);

/*  ------------------  Global Objects for Application -------------- */
require('./config/Globals')(app); // Global modules
require('./config/Environment'); // Global Env varialbles
require('./config/ApplicationConfig'); // Global variables

/*  ------------------  Cross Origin Allow -------------- */
//app.use(cors({
   // credentials: true,
   // origin: ENV.crossOriginDomain
//}));

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.use(cors());
app.options('*', cors());

/*  ------------------  Parse Cookie -------------- */
app.use(cookieParser());

/* --------------------------  BodyParser   --------------------------*/
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));*/

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


/* --------------------------  Database Connection ---------------------*/
// require('./config/Connections');

/* --------------------------  Compress Responses   -----------------*/
app.use(compression());

/* --------------------------  Public Static Access   -----------------*/
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('view cache', true);

/* --------------------------  API's   --------------------------------*/
require('./config/Routes'); // Load All Route
require('./config/Services'); // Load All Services

/* --------------------------  Error Handlers and Logs   -------------*/
require('./config/ErrorHandler');

const port = process.env.PORT || APPLICATIONCONFIG.serverPort;

app.listen(port, () => {
    logger.info(`${process.env.ENV_NAME || 'localhost'} server is running on port : ${port}`);

http.globalAgent.maxSockets = 1024;

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4005/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });*/

//http://localhost:2001/api/v1.0/houseproperty/search
});
