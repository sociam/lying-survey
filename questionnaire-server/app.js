var express = require('express');
var pg = require('pg');
var config = require('./config');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

var requireParams = function (req, res, params) {
    var errored = false;
    params.every(function (paramName, i, array) {
        var val = req.body[paramName];
        if (!val || val.length < 1) {
            errored = true;
            res.status(400).send("Bad Request\n\nParameter "+paramName+" cannot be missing or empty.\n");
            return false; // breaks
        }
        return true; // no break
    });
    return errored;
};

// CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post('/submit', function(req, res) {
    if (requireParams(req, res, ["uuid", "question_id", "answer"])){
        return; // it handled the response
    }

    var misc = req.body.misc || "";

    var q = "INSERT INTO submissions (uuid, question_id, answer, misc, submitted) VALUES ($1, $2, $3, $4, current_timestamp)";
    var params = [req.body.uuid, req.body.question_id, req.body.answer, misc];

    pg.connect(config.connString, function (err, client, done) {
        if (err) {
            done();
            return res.status(500).send("Internal Server Error");
        } else {
            client.query(q, params,
                function (err, result) {
                    done();
                    if (err) {
                        return res.status(500).send("Internal Server Error");
                    } else {
                        return res.status(200).send("OK");
                    }
                }
            );
        }
    });
});

app.listen(3000);
