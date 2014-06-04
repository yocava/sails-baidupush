/**
 * Module Dependencies
 */
var push  = require('baidu-push')
  , _     = require('lodash')
  ;



/**
 * sails-baidupush
 *
 * Most of the methods below are optional.
 *
 * If you don't need / can't get to every method, just implement
 * what you have time for.  The other methods will only fail if
 * you try to call them!
 *
 * For many adapters, this file is all you need.  For very complex adapters, you may need more flexibility.
 * In any case, it's probably a good idea to start with one file and refactor only if necessary.
 * If you do go that route, it's conventional in Node to create a `./lib` directory for your private sub-modules
 * and load them at the top of the file with other dependencies.  e.g. var update = `require('./lib/update')`;
 */
module.exports = (function () {
  "use strict";

  // You'll want to maintain a reference to each connection
  // that gets registered with this adapter.
  var connections = {};



  // You may also want to store additional, private data
  // per-connection (esp. if your data store uses persistent
  // connections).
  //
  // Keep in mind that models can be configured to use different databases
  // within the same app, at the same time.
  //
  // i.e. if you're writing a MariaDB adapter, you should be aware that one
  // model might be configured as `host="localhost"` and another might be using
  // `host="foo.com"` at the same time.  Same thing goes for user, database,
  // password, or any other config.
  //
  // You don't have to support this feature right off the bat in your
  // adapter, but it ought to get done eventually.
  //

  var adapter = {

    // Set to true if this adapter supports (or requires) things like data types, validations, keys, etc.
    // If true, the schema for models using this adapter will be automatically synced when the server starts.
    // Not terribly relevant if your data store is not SQL/schemaful.
    //
    // If setting syncable, you should consider the migrate option,
    // which allows you to set how the sync will be performed.
    // It can be overridden globally in an app (config/adapters.js)
    // and on a per-model basis.
    //
    // IMPORTANT:
    // `migrate` is not a production data migration solution!
    // In production, always use `migrate: safe`
    //
    // drop   => Drop schema and data, then recreate it
    // alter  => Drop/add columns as necessary.
    // safe   => Don't change anything (good for production DBs)
    //
    syncable: false,


    // Default configuration for connections
    defaults: {
      apiKey    : 'your api key',
      secretKey : 'your secret key',
      schema    : false
    },


    /**
     *
     * This method runs when a model is initially registered
     * at server-start-time.  This is the only required method.
     *
     * @param  {{}}       connection  [description]
     * @param  {{}}       collections [description]
     * @param  {Function} cb          [description]
     */
    registerConnection: function(connection, collections, cb) {
      if(!connection.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connection.identity]) return cb(new Error('Connection is already registered.'));

      // Add in logic here to initialize connection
      connections[connection.identity] = push.createClient(connection);

      cb();
    },


    /**
     * Fired when a model is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {{}|Function}    connectionName  [description]
     * @param  {Function}       [cb]            [description]
     * @return {*}                              [description]
     */
    teardown: function (connectionName, cb) {
      if (typeof connectionName === 'function') {
        cb = connectionName;
        connectionName = null;
      }
      if (!connectionName) {
        connections = {};
        return cb();
      }
      if(!connections[connectionName]) return cb();
      delete connections[connectionName];
      cb();
    },


    /**
     * REQUIRED method if users expect to call Model.find(),
     * or related.
     *
     * You should implement this method to respond with an array of instances.
     * Waterline core will take care of supporting all the other different
     * find methods/usages.
     *
     * @param   {{}}        connectionName  [description]
     * @param   {{}}        collectionName  [description]
     * @param   {{}}        options         [description]
     * @param   {Function}  cb              [description]
     * @returns {*}                         [description]
     */
    find: function (connectionName, collectionName, options, cb) {
      var connection = connections[connectionName];

      switch (collectionName) {
        case 'channel': return connection.queryBindList(options.where, queryBindListCallback);
        case 'message': return connection.fetchMsg(options.where, afterwards);
        case 'tag'    : return connection.fetchTag(options.where, afterwards);
        // queryUserTags
        // queryDeviceType
        default       : return afterwards('Unknown usage of find() with model (' + collectionName + ') ');
      }

      function queryBindListCallback(err, result) {
        if (err) return cb(err);
        return cb(null, result['response_params'] && result['response_params']['binds'] || []);
      }

      function afterwards(err, result) {
        if (err) return cb(err);
        return cb(err, result);
      }
    },


    /**
     * REQUIRED method if users expect to call Model.exist(),
     * or related.
     *
     * You should implement this method to respond with a single instance.
     * Waterline core will take care of supporting all the other different
     * findOne methods/usages.
     *
     * @param   {{}}        connectionName  [description]
     * @param   {{}}        collectionName  [description]
     * @param   {{}}        options         [description]
     * @param   {Function}  cb              [description]
     * @returns {*}                         [description]
     */
    exist: function (connectionName, collectionName, options, cb) {
      var connection = connections[connectionName];

      switch (collectionName) {
        case 'channel': return connection.verifyBind(options, afterwards);
        default       : return afterwards('Unknown usage of exist() with model (' + collectionName + ') ');
      }

      function afterwards(err, result) {
        if (err && !result) return cb(err);
        if (err && result['error_code']) return cb(null, false);
        return cb(null, true);
      }
    },


    /**
     *
     * @param   {{}}        connectionName  [description]
     * @param   {{}}        collectionName  [description]
     * @param   {{}}        values          [description]
     * @param   {Function}  cb              [description]
     * @returns {*}                         [description]
     */
    create: function (connectionName, collectionName, values, cb) {
      var connection = connections[connectionName];
      var payload = _.cloneDeep(values);

      switch (collectionName) {
        case 'message': return connection.pushMsg(payload, pushMsgCallback);
        case 'tag'    : return connection.setTag(payload, afterwards);
        default       : return afterwards('Unknown usage of find() with model (' + collectionName + ') ');
      }

      function pushMsgCallback(err, result) {
        if (err) return cb(err);
        values['request_id'] = result['request_id'];
        return cb(null, values);
      }

      function afterwards(err, result) {
        if (err) return cb(err);
        return cb(err, result);
      }
    },


    /**
     *
     * @param   {{}}        connectionName  [description]
     * @param   {{}}        collectionName  [description]
     * @param   {{}}        options         [description]
     * @param   {{}}        values          [description]
     * @param   {Function}  cb              [description]
     * @returns {*}                         [description]
     */
    destroy: function (connectionName, collectionName, options, values, cb) {
      var connection = connections[connectionName];

      switch (collectionName) {
        case 'message': return connection.deleteMsg(options.where, afterwards);
        case 'tag'    : return connection.deleteTag(options.where, afterwards);
        default       : return afterwards('Unknown usage of count() with model (' + collectionName + ') ');
      }

      function afterwards(err, result) {
        if (err) return cb(err);
        return cb(err, result);
      }
    },


    /**
     *
     * @param   {{}}        connectionName  [description]
     * @param   {{}}        collectionName  [description]
     * @param   {{}}        options         [description]
     * @param   {Function}  cb              [description]
     * @returns {*}                         [description]
     */
    count: function(connectionName, collectionName, options, cb) {
      var connection = connections[connectionName];

      switch (collectionName) {
        case 'message': return connection.fetchMsgCount(options.where, afterwards);
        default       : return afterwards('Unknown usage of count() with model (' + collectionName + ') ');
      }

      function afterwards(err, result) {
        if (err) return cb(err);
        return cb(err, result);
      }
    },


    /*

    // Custom methods defined here will be available on all models
    // which are hooked up to this adapter:
    //
    // e.g.:
    //
    foo: function (collectionName, options, cb) {
      return cb(null,"ok");
    },
    bar: function (collectionName, options, cb) {
      if (!options.jello) return cb("Failure!");
      else return cb();
      destroy: function (connectionName, collectionName, options, values, cb) {
       return cb();
     }

    // So if you have three models:
    // Tiger, Sparrow, and User
    // 2 of which (Tiger and Sparrow) implement this custom adapter,
    // then you'll be able to access:
    //
    // Tiger.foo(...)
    // Tiger.bar(...)
    // Sparrow.foo(...)
    // Sparrow.bar(...)


    // Example success usage:
    //
    // (notice how the first argument goes away:)
    Tiger.foo({}, function (err, result) {
      if (err) return console.error(err);
      else console.log(result);

      // outputs: ok
    });

    // Example error usage:
    //
    // (notice how the first argument goes away:)
    Sparrow.bar({test: 'yes'}, function (err, result){
      if (err) console.error(err);
      else console.log(result);

      // outputs: Failure!
    })




    */


    identity: 'sails-baidupush'

  };


  // Expose adapter definition
  return adapter;

})();

