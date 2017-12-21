const express = require('express');
const includeAll = require('include-all');
const bluebird = require('bluebird');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const _ = require('lodash');
const events = require('events');
const logger = require('tracer').colorConsole();

const customEvents = new events.EventEmitter();

module.exports = (app) => {
    const globals = {
        express,
        app,
        includeAll,
        bluebird,
        async,
        await,
        logger,
        _,
        customEvents
    };

    for (const prop in globals) {
        setGlobals(prop, globals[prop]);
    }
};

/*  Set Global constants for intire application */
global.setGlobals = (prop, value) => {
    /*  Creating global constants */
    Object.defineProperty(global, prop, {
        value,
        enumerable: true,
        writable: false,
        configurable: false
    });
};
