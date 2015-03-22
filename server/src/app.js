var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path    = require('path');
var logger  = require('morgan');
var passport = require('passport');
var csrf = require('./csrf');

var passportConfig = require('./passport-config');

// db stuff
var mongo = require('mongodb');
var monk  = require('monk');
var mongoUrl = 'mongodb://donato:oau123noazffu9invk@localhost:27017/feature';
var db = monk(mongoUrl);

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    // Added other domains you want the server to give access to
    // WARNING - Be careful with what origins you give access to
    var allowedHost = [
        'http://localhost'
    ];

    if(allowedHost.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        next();
    } else {
        res.send({auth: false});
    }
};
app.use(allowCrossDomain);



app.use(logger('dev'));


// Needed to parse the post values into json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave :true
    //store: new MongoStore({url : mongoUrl}),
}));


app.use(csrf.checkToken);
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


// Initialize passport stuff
//passportConfig(app);



// Add the routes/middleware
var routes = require('./routes');
app.use(routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log('Dev Error --!');
        console.log(err.status, err.message);
        res.send('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.status, err.message);
    res.status('error');
    res.send({
        message: err.message,
        error: {}
    });
});

app.listen(8080, function() {
    console.log('Node app is running at ' + app.get('port'))
});

module.exports = app;
