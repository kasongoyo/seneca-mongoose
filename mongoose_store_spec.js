/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */

// dependencies
const Seneca = require('seneca');

const mongooseLayer = require('./mongoose-store');
const { expect } = require('chai');

describe('Initialize seneca mongoose layer', () => {
  /* eslint-disable global-require */
  it('should the mongoose connection be ready', (done) => {
    Seneca()
      .test(done)
      .use(mongooseLayer)
      .ready(() => {
        const mongoose = require('mongoose');
        expect(mongoose.connection.readyState).to.equal(1);
        mongoose.connection.close(done);
      });
  });


  it('should connect using custom port when specified in options', (done) => {
    const port = 27017;
    Seneca()
      .test(done)
      .use(mongooseLayer, { port })
      .ready(() => {
        const mongoose = require('mongoose');
        expect(mongoose.connection.port).to.equal(port);
        mongoose.connection.close(done);
      });
  });


  it('should connect to custom database when specified in options', (done) => {
    const db = 'appDb';
    Seneca()
      .test(done)
      .use(mongooseLayer, { database: db })
      .ready(() => {
        const mongoose = require('mongoose');
        expect(mongoose.connection.db.databaseName).to.equal(db);
        mongoose.connection.close(done);
      });
  });


  it('should add single global plugin when specified in options', (done) => {
    const mongooseTimestamp = require('mongoose-timestamp');
    Seneca()
      .test(done)
      .use(mongooseLayer, { plugins: mongooseTimestamp })
      .ready(() => {
        const mongoose = require('mongoose');
        expect(mongoose.plugins).not.to.be.empty;
        mongoose.connection.close(done);
      });
  });

  it('should add multiple global plugins when specified in options', (done) => {
    const mongooseTimestamp = require('mongoose-timestamp');
    const mongooseAutopopulate = require('mongoose-autopopulate');
    Seneca()
      .test(done)
      .use(mongooseLayer, { plugins: [mongooseTimestamp, mongooseAutopopulate] })
      .ready(() => {
        const mongoose = require('mongoose');
        expect(mongoose.plugins).not.to.be.empty;
        mongoose.connection.close(done);
      });
  });
});
