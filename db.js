"use strict";
const mysql = require('mysql');
require('dotenv').config();
let db;
/*
 - try allows me to write code that may fail and catches it if it does fail. Then in the catch I can handle the error.
 - db is a variable that stores my connection to my database, the object i am passing to mySQL.createConnection is my credentials to access my database.
 - createUser is a function that takes a username and password and passes them into a prepared insert statement.
 - in node module.exports allows me to share functions between js files.
*/
try {
    db = mysql.createConnection({
        host: process.env.MY_SQL_HOST,
        user: process.env.MY_SQL_USER,
        password: process.env.MY_SQL_PASSWORD,
        database: process.env.MY_SQL_DATABASE
    });
    db.connect();
}
catch (error) {
    console.error('error ', error);
}
const storeCharacters = (values, callback, errorCallback) => {
    db.query('DELETE FROM characters', (error, results) => {
        if (error) {
            errorCallback(error);
        }
    });
    db.query('INSERT INTO characters (character_id, character_name) VALUES ?', [values], function (error, results) {
        if (error) {
            errorCallback(error);
        }
        callback();
    });
};
module.exports = {
    storeCharacters: storeCharacters,
};
