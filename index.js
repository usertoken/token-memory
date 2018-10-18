"use strict";

var Token = require("./lib/token");
var Chains = require('./lib/chains')
/**
 * Create a new link and returns a json to existing chains with link
 * @param {string} id
 * @param {json} options
 * @return {json}
 */

module.exports = function(id, options) {
  var chains = Chains.configs(options);
  var token = Token.create(id, chains);
  return token;
};
