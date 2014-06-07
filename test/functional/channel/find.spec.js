var FIXTURES  = require('../../config').fixtures
//  , util    = require('util')
//  , _       = require('lodash')
  ;

/**
 * @namespace Channel
 */

describe('Channel', function () {
  "use strict";


  describe('.find()', function () {

    it('should be responded to', function () {
      Channel.should.respondTo('find');
    });

    it('should be able to fetch all channels by given user_id and channel_id', function (done) {
      Channel.find({ user_id: FIXTURES.USER_ID, channel_id: FIXTURES.CHANNEL_ID })
        .then(function (result) {
          result.should.be.an('array').that.have.length(1);
          result[0].should.have.property('user_id', FIXTURES.USER_ID);
          result[0].should.have.property('channel_id', FIXTURES.CHANNEL_ID);
        })
        .done(done, done);
    });

    it('should be able to fetch all channels by given user_id only', function (done) {
      Channel.find({ user_id: FIXTURES.USER_ID })
        .then(function (result) {
          result.should.be.an('array').that.have.length(1);
          result[0].should.have.property('user_id', FIXTURES.USER_ID);
          result[0].should.have.property('channel_id', FIXTURES.CHANNEL_ID);
        })
        .done(done, done);
    });

    it('should NOT be able to fetch ANY channel by given channel_id only', function (done) {
      Channel.find({ channel_id: FIXTURES.CHANNEL_ID })
        .then(function (result) {
          result.should.be.an('array').that.have.length(0);
        })
        .done(done, done);
    });

    it('should NOT be able to fetch ANY channel by given nothing', function (done) {
      Channel.find({})
        .then(function (result) {
          result.should.be.an('array').that.have.length(0);
        })
        .done(done, done);
    });

    it('should be able to fetch channels of a list of user_ids (length=1)', function (done) {
      Channel.find({ user_id: [FIXTURES.USER_ID] })
        .then(function (result) {
          result.should.be.an('array').that.have.length(1);
          result[0].should.have.property('user_id', FIXTURES.USER_ID);
          result[0].should.have.property('channel_id', FIXTURES.CHANNEL_ID);
        })
        .done(done, done);
    });

    it('should be able to fetch channels of a list of user_ids (length=2)', function (done) {
      Channel.find({ user_id: [FIXTURES.USER_ID, FIXTURES.USER_ID] })
        .then(function (result) {
          result.should.be.an('array').that.have.length(1);
          result[0].should.have.property('user_id', FIXTURES.USER_ID);
          result[0].should.have.property('channel_id', FIXTURES.CHANNEL_ID);
        })
        .done(done, done);
    });

  });


});