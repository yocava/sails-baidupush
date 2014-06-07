/**
 * Module Dependencies
 */
var _     = require('lodash')
  ;


/**
 * ### TagCollection
 *
 * @type {TagCollection}
 */
var TagCollection = module.exports = function TagCollection(definition, connection) {
  "use strict";

  this.definition = definition;
  this.connection = connection;
};


////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param   {{}}              criteria
 * @param   {Function}        cb
 */
TagCollection.prototype.find = function find(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.fetchTag(criteria.where, cb);
};


/**
 *
 * @param   {{}}              values
 * @param   {Function}        cb
 */
TagCollection.prototype.create = function create(values, cb) {
  "use strict";
  var self = this;

  var payload = _.cloneDeep(values);
  self.connection.setTag(payload, cb);
};


/**
 *
 * @param   {{}}              criteria
 * @param   {{}}              values
 * @param   {Function}        cb
 */
TagCollection.prototype.update = function update(criteria, values, cb) {
  "use strict";
  var self = this;
  var payload = _.cloneDeep(values);
  self.connection.setTag(payload, cb);
};


/**
 *
 * @param   {{}}              criteria
 * @param   {{}}              criteria.where                 [description]
 * @param   {string}          [criteria.where.user_id]       - 用户标识。不超过256字节。
 * @param   {string}          [criteria.where.channel_id]    - 如果查询的绑定关系与channel_id无关，则不需要填写。
 * @param   {string}          [criteria.where.tag]           - 标签名称。
 * @param   {Function}        cb
 */
TagCollection.prototype.destroy = function destroy(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.deleteTag(criteria.where, cb);
};


/**
 *
 * @param   {{}}        criteria
 * @param   {{}}        criteria.where                 [description]
 * @param   {string}    [criteria.where.channel_id]    - 如果查询的绑定关系与channel_id无关，则不需要填写。
 * @param   {string}    [criteria.where.tag]           - 标签名称。(`tag` only)
 * @param   {number}    [criteria.start]               - 查询页码，默认为0。
 * @param   {number}    [criteria.limit]               - 一次查询条数，默认为10。
 * @param   {Function}  cb
 */
TagCollection.prototype.count = function count(criteria, cb) {
  "use strict";
  var self = this;

  self.connection.fetchTag(criteria.where, cb);
};


////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////