const geohash = require('ngeohash');

class PropertiesSearchController {
  getHouseProperties( { body }) {
    console.log("value:" + body.precision);
    if (body.top_left && body.bottom_right && body.precision) {
      const payload = {
        'query': {
          'bool': {
            'must': {
              'match_all': {}
            },

            'filter': {
              'geo_bounding_box': {
                'addresslocation': {
                  'top_left': body.top_left,
                  'bottom_right': body.bottom_right
                }
              }
            }
          }
        },
        'aggregations': {
          'large-grid': {
            'geohash_grid': {
              'field': 'addresslocation',
              'precision': body.precision

            },
            'aggregations': {
              'top_points_hits': {
                'top_hits': {
                  'size': 1,
                  '_source': {
                    'includes': ['_id']
                  }
                }
              }
            }
          }
        }
      };
      return getHouseProperties(payload);
    } else {
      throw new Error('top_left, bottom_right, precision fields are required.');
    }
  }
}

const getHouseProperties = async((payload) => {
  logger.log(JSON.stringify(payload));
  const options = {
    method: 'POST',
    url: ENV.propertiesSearch.getHouseProperties,
    headers: {
      'content-type': 'application/json'
    },
    json: payload
  };

  try {
    const serviceResponse = await(SERVICES.RequestService.callEndPoint(options));
    const payloadOfSingleProperty = [];
    serviceResponse.aggregations['large-grid'].buckets.map((item) => {
      const geoValue = geohash.decode(item.key);
      item.key = { lat: geoValue.latitude, long: geoValue.longitude };
      if (item.doc_count <= 1) {
        payloadOfSingleProperty.push({
          _id: item.top_points_hits.hits.hits[0]._id,
          _source: ['prop_common.permalink', 'prop_common.status', 'address.location', 'prop_common.bed', 'prop_common.bath', 'prop_common.sqft', 'prop_common.price', 'address.line', 'address.city', 'address.county', 'address.state']
        });
      }
      return item;
    });
    if (payloadOfSingleProperty.length != 0) {
      serviceResponse.aggregations['large-grid'].buckets = await(getDetailForSingleProperties(serviceResponse, payloadOfSingleProperty));
    }
    return generateResponse(serviceResponse);
  } catch (error) {
    throw new Error(error);
  }
});

const getDetailForSingleProperties = async((serviceResponse, payloadOfSingleProperty) => {
  const options = {
    method: 'GET',
    url: ENV.propertiesSearch.getSingleHouseProperties,
    headers: {
      'content-type': 'application/json'
    },
    json: { docs: payloadOfSingleProperty }
  };

  const singlePropertiesDetail = await(SERVICES.RequestService.callEndPoint(options));
  let tempObj = singlePropertiesDetail.docs.reduce((p, c) => {
    p[c._id] = c._source;
    return p;
  }, {});

  const tempBuckets = serviceResponse.aggregations['large-grid'].buckets;
  let count = tempBuckets.length;
  while (count > 0) {
    count--;
    if (tempBuckets[count].doc_count != 1) {
      break;
    }
    try {
      tempBuckets[count].source = tempObj[tempBuckets[count].top_points_hits.hits.hits[0]._id];
    } catch (e) {
      logger.error('error: ', e);
    }
  }
  return tempBuckets;
});

const generateResponse = (serviceResponse) => {
  const finalResponse = serviceResponse.aggregations['large-grid'].buckets.map((item) => {
    const response = {
      position: {
        coordinates: [item.key.lat, item.key.long],
        type: ''
      },
      count: item.doc_count
    };
    let ifSource;
    if (item.source) {
      ifSource = {
        ldpUrl: `realesateandhomesand-detail/${item.source.prop_common.permalink || item.source.prop_common.perma_link}`,
        id: '',
        officeName: '',
        status: item.source.address.state || '',
        type: '',
        open_house_display: '',
        bed: item.source.prop_common.bed || 0,
        bath: item.source.prop_common.bath || 0,
        lotSize: '',
        photo: '',
        photoCount: 0,
        price: item.source.prop_common.price || 0,
        priceDisplay: item.source.prop_common.price || 0,
        propertyType: item.source.prop_common.status || '',
        sqft: item.source.prop_common.sqft || 0,
        sqft_display: item.source.prop_common.sqft || 0,
        address: item.source.address.line || '',
        city: item.source.address.city || '',
        county: item.source.address.country || '',
        state: item.source.address.state || '',
        zip: item.source.address.zip || '',
        count: item.doc_count
      };
    }
    return item.source ? _.merge(response, ifSource) : response;
  });
  return finalResponse;
};

module.exports = PropertiesSearchController;