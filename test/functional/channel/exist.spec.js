var FIXTURES  = require('../../config').fixtures
//  , util    = require('util')
//  , _       = require('lodash')
  ;

/**
 * @namespace Channel
 */

describe('Channel', function () {
  "use strict";


  describe('.exist()', function () {

    it('should be able to verify a chanel by given `user_id`', function (done) {
      Channel.exist({ user_id: FIXTURES.USER_ID }, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('boolean').and.be.ok;
        done();
      });
    });

    it('should be able to verify a chanel by given `user_id` and `channel_id`', function (done) {
      Channel.exist({ user_id: FIXTURES.USER_ID, channel_id: FIXTURES.CHANNEL_ID }, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('boolean').and.be.ok;
        done();
      });
    });

    it('should NOT be able to verify a chanel by given `channel_id` only', function (done) {
      Channel.exist({ channel_id: FIXTURES.CHANNEL_ID }, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('boolean').and.be.not.ok;
        done();
      });
    });

    it('should be able to verify an in-exist chanel by given `user_id`', function (done) {
      Channel.exist({ user_id: FIXTURES.USER_ID }, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('boolean').and.be.ok;
        done();
      });
    });

  });

});