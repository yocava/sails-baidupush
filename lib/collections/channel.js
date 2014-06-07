/**
 * Module Dependencies
 */
var _     = require('lodash')
  , async = require('async')
  ;


/**
 * ### ChannelCollection
 *
 * @type {ChannelCollection}
 */
var ChannelCollection = module.exports = function ChannelCollection(definition, connection) {
  "use strict";

  this.definition = definition;
  this.connection = connection;
};


////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param   {{}}        criteria
 * @param   {Function}  cb
 */
ChannelCollection.prototype.find = function find(criteria, cb) {
  "use strict";
  var self = this, where = _.cloneDeep(criteria.where) || {};

  criteria.skip  && (where.start = Math.floor(criteria.skip / criteria.limit) || 0);
  criteria.limit && (where.limit = criteria.limit);

  // wrap with an array then flatten to normalize to an array
  var whereArray = _([where['user_id']])
    .flatten()
    .uniq()
    .map(function (user_id) {
      return _.defaults(user_id ? { user_id: user_id } : {}, where);
    })
    .value();

  async.mapLimit(whereArray, 10, function (where, done) {
    self.connection.queryBindList(where, function queryBindListCallback(err, result) {
      if (err) return cb(err);

      var channels = _.map(result['response_params'] && result['response_params']['binds'] || [], function (channel) {

        // `user_id` over precision @see {@link http://developer.baidu.com/feedback#/info/40455}
        // require to use a fork of `baidu-push` @see {@link https://github.com/clarkorz/baidu-push}
        channel.bind_time         && (channel.bind_time = new Date(channel.bind_time * 1000));
        channel.online_expires    && (channel.online_expires = new Date(channel.online_expires * 1000));
        channel.online_timestamp  && (channel.online_timestamp = new Date(channel.online_timestamp * 1000));

        try {
          channel.info            && (channel.info = JSON.parse(channel.info));
        } catch (e) {}

        return channel;
      });

      return done(null, channels);
    });
  }, function (err, results) {
    cb(err, _.flatten(results));
  });

};


/**
 *
 * @param   {{}}        criteria
 * @param   {{}}        criteria.where                  [description]
 * @param   {string}    criteria.where.user_id          - 用户标识。不超过256字节。
 * @param   {string}    [criteria.where.channel_id]     - 如果查询的绑定关系与channel_id无关，则不需要填写。
 * @param   {number}    [criteria.start]                - 查询页码，默认为0。
 * @param   {number}    [criteria.limit]                - 一次查询条数，默认为10。
 * @param   {Function}  cb
 */
ChannelCollection.prototype.count = function count(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.queryBindList(criteria.where, cb);
};


/**
 *
 * @param   {{}}        criteria
 * @param   {Function}  cb
 */
ChannelCollection.prototype.exist = function exist(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.verifyBind(criteria, function verifyBindCallback(err, result) {
    if (err && !result) return cb(err);
    if (err && result['error_code']) return cb(null, false);
    return cb(null, true);
  });
};


////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////
