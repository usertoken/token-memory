"use strict";

var Token = require("./lib/token");
/**
 * Blockchain Contract for CRUD on memories
 * @param {string} chain
 * @return {json}
 */

module.exports = function(chain) {
  var chains = Token.create(chain);
  //   var { chain } = chains;
  //   chain.get("tests").put(chain);
  return chains;
};
