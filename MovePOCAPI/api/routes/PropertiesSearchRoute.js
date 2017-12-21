const PropertiesSearch = require('../controllers/PropertiesSearchController');
const ImageUploader = require('../controllers/UploadS3');
const InvokeLambda = require('../controllers/InvokeLambda');

const router = express.Router();
const propertiesSearch = new PropertiesSearch();

// GET method for default JSON data
app.get('/houseproperty', (req, resp) => {
    var data = require('./apiData.json'); 
    console.log(data.results.property.items.length);
    for(var i=0; i< data.results.property.items.length; i++)
    {
        data.results.property.items[i]["ukey"] = i + 1;
        data.results.property.items[i]["showInfo"] = false;       
    }
    console.log("data success");
    resp.json(data)
  });

  // POST method for getting house property details
const getHouseProperties = (req, res, next) => {
    propertiesSearch.getHouseProperties(req, res, next).then((data) => {
        for(var i=0; i< data.length; i++)
        {
            data[i]["ukey"] = i + 1;
            data[i]["showInfo"] = false;
        }
        res.json(RESPONSE.success('Properties Found', data));
    }).catch((error) => {
        const message = error.errmsg || error.message || error;
        res.status(400).json(RESPONSE.error(message, {}, 'ValidationsError'));
    });
};

router.post('/houseproperty/search', getHouseProperties);

// POST method to upload images to the aws S3 bucket
app.post('/imageuploader', function (req, res) {
    
      var image = ImageUploader({
        data_uri: req.body.data_uri,
        filename: req.body.filename,
        filetype: req.body.filetype
      }).then(onGoodImageProcess, onBadImageProcess);
    
      function onGoodImageProcess(resp) {
        res.send({
          status: 'success',
          uri: resp
        });
      }
    
      function onBadImageProcess(resp) {
          console.log(resp.errmsg);
        res.send({
         status: 'error'
        });
      }
    
    });

    // POST method to process the images using aws Lambda rekognition
    app.post('/invokeimagelambda', function (req, res) {
        
          var image = InvokeLambda({
            postData: req.body
          }).then(onGoodImageProcess, onBadImageProcess);
        
          function onGoodImageProcess(resp) {
            res.send({
              status: 'success',
              data: resp
            });
          }
        
          function onBadImageProcess(resp) {
              console.log(resp.errmsg);
            res.send({
             status: 'error'
            });
          }
        
        });

module.exports = {
    router
};