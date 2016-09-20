//####################################################################
// Node.js file - part of the seneca-mongoose module
//####################################################################

'use strict';

//####################################################################
// Require Node dependencies
//####################################################################
const Mongoose = require('mongoose');

//####################################################################
// Require App dependencies
//####################################################################

//####################################################################
// Define local vars
//####################################################################

//####################################################################
// Define local methods
//####################################################################

//####################################################################
// Define exports
//####################################################################
module.exports = function (options) {

    const seneca = this;

    options = seneca.util.deepextend({
        
        dbURI: 'mongodb://localhost/test'

    }, options);

    seneca.add({ init: 'seneca_mongoose' }, (args, next) => {

        Mongoose.connect(dbURI);

        Mongoose.connection.on('connected', function () {

            console.log('Mongoose default connection open to ' + dbURI);

            return next();
        });

        Mongoose.connection.on('error',function (err) {

            console.error('Mongoose default connection error: ' + err);

            return seneca.fail({error: err}, next);
        });

        Mongoose.connection.on('disconnected', function () {  
            
            console.log('Mongoose default connection disconnected'); 
        });

        process.on('SIGINT', function() {  
            Mongoose.connection.close(function () { 
                console.log('Mongoose default connection disconnected through app termination'); 
                process.exit(0); 
            }); 
        }); 
    });

    return 'seneca_mongoose';
};