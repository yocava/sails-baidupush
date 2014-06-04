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

    it('should be able to fetch all channels', function (done) {
      Channel.find({ user_id: FIXTURES.USER_ID })
        .then(function (result) {
          result.should.be.an('array').that.not.have.length(0);
        })
        .done(done, done);
    });

  });


});