"use strict";

var Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/lib/path.js");
require("gun-unset");

var USERTOKEN = "USERTOKEN";
var ATTRIBUTE = "ATTRIBUTE";
var STORAGE = "STORAGE";
var peers = ["troposphere.usertoken.com"];

var chainEngine = Gun({
  peers: peers,
  radisk: false
  // file: 'radata'
});

/**
 * Blockchain Contract for CRUD on memories
 * @param {string} chainID
 * @return {jsob}
 */

var create = id => {
  var chain = chainEngine.get(id);
  var attributeChain = chainEngine.get(ATTRIBUTE);
  var storageChain = chainEngine.get(STORAGE);
  var masterChain = chainEngine.get(USERTOKEN);

  masterChain.path("GLOBAL_CHAINS").set(chain);
  chain.path("GENESIS_CHAINS").set(masterChain);

  var chains = {
    chainEngine,
    attributeChain,
    storageChain,
    masterChain,
    chain
  };
  //   console.log("1.token chains : ", chains);
  return chains;
};

module.exports = { create };
