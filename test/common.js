process.env.NODE_ENV = 'testing';

// Expose all assertion styles on global
global.chai = require('chai');
global.should = chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

//install plugin(s)
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);