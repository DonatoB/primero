var express = require('express');
var _ = require('underscore');
var router = express.Router();

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

router.get(URL + '/:build_number', function(req, res) {
    var db = req.db;

    var buildNumber = req.params.build_number;

    var collection = db.get(TABLE);
    collection.find({build : buildNumber},{},function(e,docs){
        res.json(docs);
    });
});


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


module.exports = router;