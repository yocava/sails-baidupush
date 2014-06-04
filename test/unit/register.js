/**
 * Test dependencies
 */
var Adapter = require('../../')
  , _       = require('lodash')
  , config  = require('../config')
  ;


describe('registerConnection', function () {

	it('should not hang or encounter any errors', function (done) {
    var connection  = _.defaults({ identity: 'baidupush' }, config.connections.baidupush)
      , collections = {
          binds: { identity: 'bind' }
        }
      ;
		Adapter.registerConnection(connection, collections, done);
	});

	// e.g.
	// it('should create a mysql connection pool', function () {})
	// it('should create an HTTP connection pool', function () {})
	// ... and so on.
});