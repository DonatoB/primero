var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path    = require('path');
var logger  = require('morgan');
var passport = require('passport');

var passportConfig = require('./passport-config');

// db stuff
var mongo = require('mongodb');
var monk  = require('monk');
var mongoUrl = 'mongodb://donato:oau123noazffu9invk@localhost:27017/feature';
var db = monk(mongoUrl);

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
app.use(allowCrossDomain);


app.use(logger('dev'));

// Needed to parse the post values into json
var bodyParser = require('body-parser');

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    store: new MongoStore({url : mongoUrl}),
    saveUninitialized: true,
    resave :true
}));


// Initialize passport stuff
passportConfig(app);

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

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
    res.send('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8080, function() {
    console.log('Node app is running at ' + app.get('port'))
});

module.exports = app;
