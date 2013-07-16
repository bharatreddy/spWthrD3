/*
* import Dst index data from mongoDB
*/

exports.getData = function(req, res){
    
    var dbloc = 'mongodb://sd_dbread:5d@sd-work9.ece.vt.edu/gme';

    var sdt = new Date(req.query.sdt);
    var edt = new Date(req.query.edt);

    require('mongodb').MongoClient.connect(dbloc, function(err, db) {

        if(!err) {
            console.log("Succesfully established connection to database");
        } else {
            console.log(err);
        }

        db.collection('dst', function(err, coll){

            coll.find({'time': {'$gte': sdt, '$lte': edt}},
                {'time': true, 'dst': true})
                .toArray(function(err, docs){

                    res.type('application/json');
                    res.send( docs );

            });

        });

    });
};