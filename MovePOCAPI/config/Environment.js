//const dev = require('./ENV/DEV.json');
// const qa = require('./ENV/QA.json');
// const prod = require('./ENV/PROD.json');
const local = require('./ENV/LOCAL.json');
class Environment {
    constructor() {
        init();
    }
}

const init = () => {
    const envName = process.env.ENV_NAME;
    let globalVariables = {};
    switch (envName) {
        case 'DEV':
            globalVariables = dev;
            break;
        case 'QA':
            globalVariables = qa;
            break;
        case 'PROD':
            globalVariables = prod;
            break;
        default:
            globalVariables = local;
            break;
    }

    setGlobals('ENV', globalVariables);
};

module.exports = new Environment();