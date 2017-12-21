module.exports = (model, body) => {
    for (const key in body) {
        model[key] = body[key];
    }
    return model;
};
