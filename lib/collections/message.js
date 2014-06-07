/**
 * Module Dependencies
 */
var _     = require('lodash')
  ;


/**
 * ### MessageCollection
 *
 * @type {MessageCollection}
 */
var MessageCollection = module.exports = function MessageCollection(definition, connection) {
  "use strict";

  this.definition = definition;
  this.connection = connection;
};


////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param criteria
 * @param cb
 */
MessageCollection.prototype.find = function find(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.fetchMsg(criteria.where, cb);
};


/**
 *
 * @param values
 * @param cb
 */
MessageCollection.prototype.create = function create(values, cb) {
  "use strict";
  var self = this;

  var payload = _.cloneDeep(values);

  self.connection.pushMsg(payload, function pushMsgCallback(err, result) {
    if (err) return cb(err);
    values['msg_id'] = values['request_id'] = result['request_id'];
    return cb(null, values);
  });
};


/**
 *
 * @param criteria
 * @param values
 * @param cb
 */
MessageCollection.prototype.update = function update(criteria, values, cb) {
  "use strict";
  var self = this;

  cb(null, values);
};


/**
 *
 * @param   {{}}              criteria
 * @param   {{}}              criteria.where                 [description]
 * @param   {string}          [criteria.where.user_id]       - 用户标识。不超过256字节。
 * @param   {string}          [criteria.where.channel_id]    - 如果查询的绑定关系与channel_id无关，则不需要填写。
 * @param   {string|string[]} [criteria.where.msg_ids]       - 删除的消息id列表，由一个或多个msg_id组成，多个用json数组表示。如：123 或 [123, 456]。
 * @param cb
 */
MessageCollection.prototype.destroy = function destroy(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.deleteMsg(criteria.where, cb);
};


/**
 *
 * @param criteria
 * @param cb
 */
MessageCollection.prototype.count = function count(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.fetchMsgCount(options.where, cb);
};


////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////