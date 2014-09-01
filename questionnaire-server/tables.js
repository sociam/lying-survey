var config = require("./config");
var pg = require("pg");

/*
 * Make a User / DB like this:
 *
 *   CREATE DATABASE questionnaire;
 *   (connect to questionnaire db)
 *
 *   create user questionnaire with login password 'blahblahblah';
 *
 *   grant all on database questionnaire to questionnaire;
 *
 * Then put those into config.js
 *
 * */

var queries = [
    'CREATE TABLE "submissions" (id serial primary key not null, uuid character varying, question_id character varying, answer character varying, misc character varying, submitted timestamp with time zone)',
];

var exit = function () { process.exit() };

pg.connect(config.connString, function (err, client, done) {
    if (err) {
        done();
        console.error("Error fetching client from pool", err);
        return exit();
    }

    var nextQuery = function () {
        if (queries.length < 1) {
            done(); // release client to pool
            console.log("Finished creating tables");
            return exit();
        }
        var query = queries.shift();
        client.query(query, [], function (err, result) {
            if (err) {
                done();
                console.error("Error running query", err, query);
                return exit();
            }
            console.log("Ran a query");
            nextQuery();
        });
    }

    nextQuery();
});
