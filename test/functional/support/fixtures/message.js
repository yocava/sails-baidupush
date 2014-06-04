/**
 * Dependencies
 */

var Waterline = require('waterline');

/**
 * Message
 *
 * @class Message
 */
module.exports = Waterline.Collection.extend({

  identity: 'message',

  tableName: 'message',

  connection: 'baidupush',

  attributes: {
  }

});
