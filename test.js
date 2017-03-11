{
    'use strict';

    //dependencies
    const path = require('path');
    const Seneca = require('seneca');
    const mongooseLayer = require(path.join(__dirname, 'mongoose-store'));
    const expect = require('chai').expect;

    describe('Initialize seneca mongoose layer', function () {

        it('should the mongoose connection be ready', function (done) {
            Seneca()
                .test(done)
                .use(mongooseLayer)
                .ready(function () {
                    const mongoose = require('mongoose');
                    expect(mongoose.connection.readyState).to.equal(1);
                    mongoose.connection.close(done);
                });
        });


        it('should connect using custom port when specified in options', function (done) {
            const port = 27017;
            Seneca()
                .test(done)
                .use(mongooseLayer, { port: port })
                .ready(function () {
                    const mongoose = require('mongoose');
                    expect(mongoose.connection.port).to.equal(port);
                    mongoose.connection.close(done);
                });
        });


        it('should connect to custom database when specified in options', function (done) {
            const db = 'appDb';
            Seneca()
                .test(done)
                .use(mongooseLayer, { database: db })
                .ready(function () {
                    const mongoose = require('mongoose');
                    expect(mongoose.connection.db.databaseName).to.equal(db);
                    mongoose.connection.close(done);
                });
        });


        it('should add single global plugin when specified in options', function (done) {
            const mongooseTimestamp = require('mongoose-timestamp');
            Seneca()
                .test(done)
                .use(mongooseLayer, { plugins: mongooseTimestamp })
                .ready(function () {
                    const mongoose = require('mongoose');
                    expect(mongoose.plugins).not.to.be.empty;
                    mongoose.connection.close(done);
                });
        });

        it('should add multiple global plugins when specified in options', function (done) {
            const mongooseTimestamp = require('mongoose-timestamp');
            const mongooseAutopopulate = require('mongoose-autopopulate');
            Seneca()
                .test(done)
                .use(mongooseLayer, { plugins: [mongooseTimestamp, mongooseAutopopulate] })
                .ready(function () {
                    const mongoose = require('mongoose');
                    expect(mongoose.plugins).not.to.be.empty;
                    mongoose.connection.close(done);
                });
        });

    });

}