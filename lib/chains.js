"use strict";

/**
 * returns global chains
 * @param {json} options
 * @return {json}
 */

function configs(options) {
  var TOKEN_CHAIN = "USERTOKEN";
  var ATTRIBUTES_CHAIN = "ATTRIBUTES";
  var STORAGE_CHAIN = "STORAGE";
  var CHANNELS_CHAIN = "CHANNELS";
  var DATA_LOCATION = "chainsdata";
  var PEERS = ["troposphere.usertoken.com"];

  var OPTIONS = {
    TOKEN_CHAIN : options && options.TOKEN_CHAIN? options.TOKEN_CHAIN : TOKEN_CHAIN,
    ATTRIBUTES_CHAIN : options && options.ATTRIBUTES_CHAIN? options.ATTRIBUTES_CHAIN : ATTRIBUTES_CHAIN,
    STORAGE_CHAIN : options && options.STORAGE_CHAIN? options.STORAGE_CHAIN : STORAGE_CHAIN,
    CHANNELS_CHAIN : options && options.CHANNELS_CHAIN? options.CHANNELS_CHAIN : CHANNELS_CHAIN,
    PEERS : options && options.PEERS? options.PEERS : PEERS,
    ENGINE : options && options.ENGINE? options.ENGINE : {
      peers: PEERS,
      radisk: true,
      file: DATA_LOCATION
    }
  };
  
  return OPTIONS;
};


module.exports = { configs }