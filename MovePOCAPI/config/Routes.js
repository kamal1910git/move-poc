class Routes {
    constructor(app) {
        init(app);
    }
}

const init = (app) => {
    /* Get all files name from api/routes */
    const routes = includeAll({
        dirname: require('path').resolve(__dirname, '../api/routes'),
        filter: /(.+)\.js$/
    });

    const globalRoutes = {};
    for (const fileName in routes) {
        /* Get Object by name */
        const route = require(`../api/routes/${fileName}`);
        globalRoutes[fileName] = route;

        app.use(`/api/${APPLICATIONCONFIG.apiVersion}`, route.router); // proxy URL
    }

    app.get('/', (req, res) => {
        res.send('<h1>showcaseservices' + process.env.ENV_NAME + ' server is running.</h1>');
    });

    /*  Setting Routes for Global access eg. routes.routeName(filename) */
    setGlobals('ROUTES', globalRoutes);
};

module.exports = new Routes(app);