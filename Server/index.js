var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var app = express();
var router = express.Router();
var http = require('http');
var inspect = require('util').inspect;
var AWS = require('aws-sdk');
var underscore = require('underscore');
var Busboy = require('busboy');
var client = require('twilio')('AC06575031527eced975061c93bd0fa4d3', '6e22e57330fad2be3527a7ac6e73a4d2');
/*var fs = require('fs');
var ElasticsearchCSV = require('elasticsearch-csv');*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://cmpe295buser:cmpe295buser@ds115738.mlab.com:15738/cmpe295b');
/*mongoose.connect('mongodb://127.0.0.1:27017/295bproject');*/

var cookieParser = require('cookie-parser');
var session = require('express-session');

var userRoute = require('./routes/userRoute.js');
var productRoute = require('./routes/productRoute.js');
var categoryRoute = require('./routes/categoryRoute.js');
var categoryItemRoute = require('./routes/categoryItemRoute.js');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(session({ secret: 'cmpe295b' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./config/passport')(passport);

/* User Route */

router.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.status(400).send({ success: false, message: info });
        }

        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, user: user._id, message: info });
        });
    })(req, res, next);
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.status(400).send({ success: false, message: info });
        }

        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, user: user._id, message: info });
        });
    })(req, res, next);
});

router.post('/users', userRoute.saveUser);
router.get('/users', userRoute.getAllUsers);
router.get('/user?:user_id', userRoute.getUser);
router.put('/users', userRoute.updateUser);
router.delete('/user/:user_id', userRoute.deleteUser);

router.post('/products', productRoute.saveProduct);
router.get('/products', productRoute.getAllProducts);

router.post('/categories', categoryRoute.saveCategory);
router.get('/categories', categoryRoute.getAllCategories);

router.post('/categoryItems', categoryItemRoute.saveCategoryItem);
router.get('/categoryItems?:categoryId', categoryItemRoute.getCategoryItems);
/*router.post('/presignedurl', function(req, res, next) {
    var d = new Date();
    var s3 = new AWS.S3();
    var params = {
        Bucket: "cmpe295b-userdata",
        Key: req.body.userId + '|' + d.toLocaleDateString(),
        ContentType: "multipart/form-data"
    }
    s3.getSignedUrl('putObject', params, function(err, response) {;
        res.json({'url':response});
    });
});
*/
router.post('/uservitals', function(req, res, next) {
    var userId = req.body.userId;
    var dates = [];
    var creds = {
        bucket: 'cmpe295b-userdata',
        access_key: 'AKIAJZAA76YBHHURP3VA',
        secret_key: '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'
    }

    var params = {
        Bucket: creds.bucket
    };

    var s3 = new AWS.S3();
    s3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var data = underscore.pluck(data.Contents, 'Key');
            if (data) {
                var userKeys = underscore.each(data, function(item) {
                    return item.indexOf(userId) !== -1
                });
                var splitKeys = underscore.map(userKeys, function(key) {
                    console.log(key);
                    var d = new Date(key.split("|")[0]);
                    dates.push(d);
                    return d
                })
                dates = underscore.sortBy(dates, function(d) {
                    return d
                });
                res.json({ 'dates': dates });
            }

        } // successful response
    });

});

router.post('csvToEs', function(req, res, next) {
    var esCSV = new ElasticsearchCSV({
        es: { index: 'my_index', type: req.body.key, host: '127.0.0.1:9200' },
        csv: { filePath: req.body.url, headers: true }
    });

    esCSV.import()
        .then(function(response) {
            // Elasticsearch response for the bulk insert 
            console.log(response);

            console.log('Done parsing form!');
            res.json(response);
        }, function(err) {
            // throw error 
            throw err;
        });
});

/*router.post('/userData', function(req, res, next) {
    console.log("HERE");
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
            var creds = {
                bucket: 'cmpe295b-userdata',
                access_key: 'AKIAJZAA76YBHHURP3VA',
                secret_key: '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'
            }

            var params = {
                Bucket : creds.bucket,
                Key: req.body.keyName,
                Body: file
            };

            var s3 = new AWS.S3();

            s3.putObject(params, function(err, data) {
                if (err) {
                    // There Was An Error With Your S3 Config
                    console.log("Problem with S3 configuration");
                    return false;
                } else {
                    console.log(data);
                    var url = 'http://cmpe295b-userdata.s3.amazonaws.com/' + req.body.keyName;
                        var esCSV = new ElasticsearchCSV({
                            es: { index: 'my_index', type: req.body.keyName, host: '127.0.0.1:9200' },
                            csv: { filePath: url, headers: true }
                        });

                    esCSV.import()
                        .then(function(response) {
                            // Elasticsearch response for the bulk insert 
                            console.log(response);

                            console.log('Done parsing form!');
                            res.json(response);
                        }, function(err) {
                            // throw error 
                            throw err;
                        });
                }
            })

        });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function(file) {
        console.log(file, 'Finished');
    });
    req.pipe(busboy);
})*/



router.post('/predict', function(req, res, next) {
    //require the Twilio module and create a REST client
            predictSpO2();

            client.sendMessage({

                to: '+14089133744', // Any number Twilio can deliver to
                from: '+14087419222 ', // A number you bought from Twilio and can use for outbound communication
                body: 'Predicted values: High chance of Sleep Apnea condition' // body of the SMS message

            }, function(err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."

                } else {
                    console.log(err);
                }
                res.json({ "done": "yes" });
            });
        //Send an SMS text message


});

app.use('/api', router);

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.use(function(req, res, next) {
    console.log('Request recieved');
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
