var express = require('express');

// count the views
var parseurl = require('parseurl');
var _ = require('underscore');
var router = express.Router();

var csrf = require('./csrf');
var allCards = require('./cards');


function getData(req) {
    var sessionInfo = {
        auth : true,
        id : req.session.id,
        _csrf : req.session._csrf,
        username : req.session.username
    };
    var userInfo = {
        cards : allCards
    };

    return _.extend(sessionInfo, userInfo);
}

router.get('/session', function(req, res){
    // This checks the current users auth
    // It runs before Backbones router is started
    // we should return a csrf token for Backbone to use
    if(typeof req.session.username !== 'undefined'){
        res.send(getData(req));
    } else {
        res.send({auth: false, _csrf: req.session._csrf});
    }
});

router.post('/session', function(req, res) {
    // Login
    // Here you would pull down your user credentials and match them up
    // to the request
    if (!req.body.username) {
        next();
    }

    req.session.username = req.body.username;
    res.send(getData(req));
});


router.delete('/session(/:abc)', function(req, res, next){
    console.log("DELETE session");
    console.log("Logout: ", req.session.username);

    // Logout by clearing the session
    req.session.regenerate(function(err){
        if (err) {
            console.log(err);
        }
        console.log('regenerating');
        // Generate a new csrf token so the user can login again
        // This is pretty hacky, connect.csrf isn't built for rest
        // I will probably release a restful csrf module
         csrf.generate(req, res, function () {
             console.log("hihi'");
             console.log(req.session._csrf);
            res.send({auth: false, _csrf: req.session._csrf});
         });
    });
});


/*

 var TABLE = 'features';
 var URL = '/features';
 function update(db, feature) {
 var collection = db.get(TABLE);

 var where = {
 build: feature.build,
 name: feature.name
 };

 var options = {
 upsert : true // insert if not present
 };

 collection.update(
 where,
 feature,
 options
 );
 }

 router.get(URL, function(req, res) {
 var db = req.db;
 var collection = db.get(TABLE);
 collection.find({},{},function(e,docs){
 res.json(docs);
 });
 });

 router.get('/session/:id', function(req, res) {
 var views = req.session.views;
 if (!views) {
 views = req.session.views = {};
 }

 // get the url pathname
 var pathname = parseurl(req).pathname;

 // count the views
 views[pathname] = (views[pathname] || 0) + 1

 res.send({view:views});
 });
 */


/*
router.get('/features/:build_number', function(req, res) {

    var views = req.session.views;
    if (!views) {
        views = req.session.views = {};
    }

    // get the url pathname
    var pathname = parseurl(req).pathname;

    // count the views
    views[pathname] = (views[pathname] || 0) + 1

    //console.log('after', req.session.views);

    //req.session.save();
    res.json({
        ex : 'hi',
        sess : views
    });

    var db = req.db;

    var collection = db.get(TABLE);
    collection.find({build : buildNumber},{},function(e,docs){
        res.json(docs);
    });
});
*/


/*
// Update
router.put(URL + '/:id', function(req, res) {
    var db = req.db;

    var obj = _.pick(req.body, ['state', 'feature', 'comment', 'user', 'build']);

    var t = new Date();
    _.extend(obj, {
        time : t,
        name : req.body.id
    });
    update(db, obj);

    res.json({time: t});
});

*/
module.exports = router;