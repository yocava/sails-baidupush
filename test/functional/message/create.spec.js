var FIXTURES  = require('../../config').fixtures
    //  , util    = require('util')
    //  , _       = require('lodash')
  ;

/**
 * @namespace Message
 */

describe('Message', function () {
  "use strict";

  describe('.create()', function () {

    it('should be responded to', function () {
      Message.should.respondTo('create');
    });

    it.skip('should push a message to all users', function (done) {
      var messages = [{ title: 'hello', description: 'Hello, Utopia!' }];
      var payload  = { push_type: 3, message_type: 1, messages: messages, msg_keys: [Date.now().toString()] };
      Message.create(payload).toPromise().should.be.fulfilled.and.notify(done);
    });

    it.skip('should response a model instance without API properties', function (done) {
      var messages = [{ title: 'hello', description: 'Hello, Utopia!' }];
      var payload  = { push_type: 3, message_type: 1, messages: messages, msg_keys: [Date.now().toString()] };
      Message.create(payload)
        .then(function (model) {
          model.should.not.contain.keys('method', 'timestamp', 'apikey');
        })
        .done(done, done);
    });

    it.skip('should be able to push a message to a particular user by given a `user_id`', function (done) {
      var messages = [{ title: 'hello', description: 'Hello, Utopia!' }];
      var payload  = { push_type: 1, user_id: FIXTURES.USER_ID, message_type: 1, messages: messages, msg_keys: [Date.now().toString()] };
      Message.create(payload).toPromise().should.be.fulfilled.and.notify(done);
    });

    it.skip('should be able to push one message to a particular user by given a `user_id`', function (done) {
      var messages = { title: 'hello', description: 'Hello, Utopia!' };
      var payload  = { push_type: 1, user_id: FIXTURES.USER_ID, message_type: 1, messages: messages, msg_keys: Date.now().toString() };
      Message.create(payload).toPromise().should.be.fulfilled.and.notify(done);
    });

    it.skip('should be able to push multiple messages to a particular user by given a `user_id`', function (done) {
      var message1 = { title: 'hello 1', description: 'Hello, Utopia!' };
      var message2 = { title: 'hello 2', description: 'Hello, Utopia!' };
      var payloads = [
        { push_type: 1, user_id: FIXTURES.USER_ID, message_type: 1, messages: message1, msg_keys: Date.now().toString() },
        { push_type: 1, user_id: FIXTURES.USER_ID, message_type: 1, messages: message2, msg_keys: Date.now().toString() }
      ];
      Message.create(payloads).toPromise().should.be.fulfilled.and.notify(done);
    });

    it('should NOT be able to push a message to a particular user by given a `channel_id`', function (done) {
      var messages = [{ title: 'hello', description: 'Hello, Utopia!' }];
      var payload  = { push_type: 1, channel_id: FIXTURES.CHANNEL_ID, message_type: 1, messages: messages, msg_keys: [Date.now().toString()] };
      Message.create(payload).toPromise().should.be.rejected.and.notify(done);
    });

  });

});