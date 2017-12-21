const path = require('path');

class Service {
    constructor() {
        init();
    }
}


const init = () => {
    const services = includeAll({
        dirname: require('path').resolve(__dirname, '../api/services'),
        filter: /(.+)\.js$/
    });

    const globalServices = {};

    for (const fileName in services) {
        globalServices[fileName] = require(`../api/services/${fileName}`);
    }

    /*  Setting Services for Global access eg. services.servicesName(filename) */
    setGlobals('SERVICES', globalServices);
};

module.exports = new Service();