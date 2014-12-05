var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM account', function(err, rows) {
                if (err)
                    console.log("Error Selecting : %s ", err);
                res.json({
                    'accounts': {
                        data: rows
                    }
                });
            });
        });
    })
    .post(function(req, res) {
        res.json({
            message: 'Not Implemented'
        });
    });

module.exports = router;