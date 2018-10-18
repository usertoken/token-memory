"use strict";

var UUIDv5 = require('uuid/v5');
var Gun = require("gun/gun");
require("gun/lib/path.js");
require('gun/lib/store');

var ROOT_SEED = "troposphere.usertoken.com";
var PEERS = [ROOT_SEED];
var DEFAULT_URL = `https://${ROOT_SEED}/tokens`;
var DATA_LOCATION = "chainsdata";

var TOKEN_CHAIN = "USERTOKEN";
var ATTRIBUTES_CHAIN = "ATTRIBUTES";
var STORAGE_CHAIN = "STORAGE";
var CHANNELS_CHAIN = "CHANNELS";

var tokenConfigs = {
  TOKEN_CHAIN,
  ATTRIBUTES_CHAIN,
  STORAGE_CHAIN,
  CHANNELS_CHAIN,
  PEERS : PEERS,
  ENGINE : {
    peers: PEERS,
    radisk: true,
    file: DATA_LOCATION
  }
};

/**
 * Add a token to global chains
 * @param {string} id
 * @param {json} configs
 * @return {json}
 */

module.exports = function(id, configs) {
  var options = configs? configs : tokenConfigs;
  var tokenEngine = Gun(options.ENGINE);
  // create new chains
  var ROOT_URL = `${DEFAULT_URL}/${id.toLowerCase()}`;
  var id_Attributes = UUIDv5(`${ROOT_URL}/${ATTRIBUTES_CHAIN.toLowerCase()}`,UUIDv5.URL);
  var id_Storage = UUIDv5(`${ROOT_URL}/${STORAGE_CHAIN.toLowerCase()}`,UUIDv5.URL);
  var id_Channels = UUIDv5(`${ROOT_URL}/${CHANNELS_CHAIN.toLowerCase()}`,UUIDv5.URL);

  var token = tokenEngine.get(id.toLowerCase());
  var attributes = tokenEngine.get(id_Attributes);
  var storage = tokenEngine.get(id_Storage);
  var channels = tokenEngine.get(id_Channels);

  // create new links
  var tokenGenesisLink = tokenEngine.get(options.TOKEN_CHAIN);
  var attributesGenesisLink = tokenEngine.get(options.ATTRIBUTES_CHAIN);
  var storageGenesisLink = tokenEngine.get(options.STORAGE_CHAIN);
  var channelsGenesisLink = tokenEngine.get(options.CHANNELS_CHAIN);

  // add new links to new chains
  tokenGenesisLink.path(options.TOKEN_CHAIN).set(token); // T0 <- TOKENS[T1, T2, ... Tn] // defines paths to Tn from T0
  attributesGenesisLink.path(options.ATTRIBUTES_CHAIN).set(attributes)
  storageGenesisLink.path(options.STORAGE_CHAIN).set(storage)
  channelsGenesisLink.path(options.CHANNELS_CHAIN).set(channels)

  // add paths to new chains
  attributes.path(options.ATTRIBUTES_CHAIN).set(attributesGenesisLink);
  storage.path(options.STORAGE_CHAIN).set(storageGenesisLink);
  channels.path(options.CHANNELS_CHAIN).set(channelsGenesisLink);

  // add paths to new token
  token.path(options.TOKEN_CHAIN).set(tokenGenesisLink); // Tn <- TOKEN_CHAIN[T0] // defines path to T0 from Tn
  token.path(options.ATTRIBUTES_CHAIN).set(attributesGenesisLink); // Tn <- ATTRIBUTES_CHAIN[A0]  // defines path to A0
  token.path(options.STORAGE_CHAIN).set(storageGenesisLink); // Tn <- STORAGE_CHAIN[S0]
  token.path(options.CHANNELS_CHAIN).set(channelsGenesisLink); // Tn <- CHANNELS_CHAIN[C0]

  return token;
};
