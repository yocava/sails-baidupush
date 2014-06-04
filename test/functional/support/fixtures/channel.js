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

  identity: 'channel',

  tableName: 'channel',

  connection: 'baidupush',

  attributes: {
  }

});
