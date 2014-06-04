var _ = require('lodash');

module.exports = _.merge(
    {}
  , require('./connections')
  , require('./fixtures')
  , require('./local')
);