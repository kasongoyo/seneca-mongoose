//####################################################################
// Node.js file - part of the seneca-mongoose module
//####################################################################

'use strict';

//####################################################################
// Require Node dependencies
//####################################################################
const mongoose = require('mongoose');


//####################################################################
// Define exports
//####################################################################


/**
 * @param {Object} options
 * keys:  
 *  - host ~ mongoose host address. Default 127.0.0.1
 *  - port ~ port number to bind with host. 
 *  - user ~ username to login to mongo db.
 *  - password ~ password to login to mongo db.
 *  - database ~ database name. Default to 'test'
 *  - plugins ~ Array|Object of instance of mongoose plugins
 */
module.exports = function (options) {




    const seneca = this;


    seneca.add({ init: 'seneca-mongoose' }, (args, next) => {
        //Don't try to open unclosed connection
        if (mongoose.connection.readyState) {
            return;
        }

        //generate mongoose connection uri string
        const host = options.host || '127.0.0.1';
        const port = options.port ? `:${options.port}` : '';
        const user = options.user || '';
        const password = options.password || '';
        const database = options.database || 'test';
        const login = (user.length > 0) ? user + ':' + password + '@' : '';
        const uristring = 'mongodb://' + login + host + port + '/' + database;

        //mongo options
        const mongoOptions = options.dbOptions;

        //Add schema wise mongoose plugins
        const plugins = extractPlugins(options.plugins);
        if (plugins) {
            plugins.forEach(plugin => mongoose.plugin(plugin));
        }

        // Create the database connection 
        mongoose.connect(uristring, mongoOptions);

        //From Mongoose 4.2+ you must explicitly set default promise implementation for schema to use
        mongoose.Promise = global.Promise;

        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected', function () {

            console.log('mongoose default connection open to ' + uristring);

            return next();
        });

        // If the connection throws an error
        mongoose.connection.on('error', function (err) {

            console.error('mongoose default connection error: ' + err);

            return seneca.fail({ error: err }, next);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {

            console.log('mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log('mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    });

    return 'seneca-mongoose';
};


/**
 * Extract plugins from module options
 * 
 * @param {Array|Object} plugins
 * @returns {Array} mongoose plugins
 */
function extractPlugins(plugins) {
    if (!plugins) {
        return undefined;
    }
    if (!Array.isArray(plugins)) {
        return [plugins];
    }
    return plugins;
}