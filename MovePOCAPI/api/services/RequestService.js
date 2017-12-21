const request = require('request');
const URL = require('url');

const getOptions = (options) => {
  let url = options.url.replace(/ /g, '%20');
  options.url = URL.parse(url);
  options.method = options.method || 'GET';
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['Host'] = options.url.host;
  options.headers['User-Agent'] = 'request';
  return options;
};

const callEndPoint = (optionsObject, bodyStatus) => {
  return new Promise((resolve, reject) => {
    request(optionsObject, (error, response, body) => {
      if (error) {
        reject(error);
      }

      if (response && response.statusCode === 200) {
        if (bodyStatus) {
          try {
            resolve(body);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(response);
        }
      } else {
        reject(response);
      }
    });
  });
};


class RequestService {
  loginEndPoint(optionsObject) {
    return callEndPoint(optionsObject);
  }

  callEndPoint(optionsObject) {
    const options = getOptions(optionsObject);
    return callEndPoint(options, true);
  }
}

module.exports = new RequestService();