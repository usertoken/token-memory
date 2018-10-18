"use strict";

var UUIDv5 = require('uuid/v5');
var Gun = require("gun/gun");
require("gun/lib/path.js");
require('gun/lib/store');

/**
 * chainConfigs - returns global chains
 * @param {json} options
 * @return {json}
 */

function chainConfigs(options) {
  var TOKEN_CHAIN = "USERTOKEN";
  var ATTRIBUTES_CHAIN = "ATTRIBUTES";
  var STORAGE_CHAIN = "STORAGE";
  var CHANNELS_CHAIN = "CHANNELS";
  var DATA_LOCATION = "chainsdata";
  var PEERS = ["troposphere.usertoken.com"];

  var configs = {
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
  return configs;
};

/**
 * createToken - Add a token to global chains
 * @param {string} id
 * @param {json} options
 * @return {[link,{json}]}
 */

function createToken(id, options) {
  var tokenEngine = Gun(options.ENGINE);
  
  var DEFAULT_URL = 'https://troposphere.usertoken.com/tokens/';
  var ROOT_URL = options.ENGINE && options.ENGINE.peers && options.ENGINE.peers[0]? 
  `${options.ENGINE.peers[0]}/tokens/${id}` : `${DEFAULT_URL}/${id}`;

  // create new chains
  var id_Attributes = UUIDv5(`${ROOT_URL}/attributes`,UUIDv5.URL);
  var id_Storage = UUIDv5(`${ROOT_URL}/storage`,UUIDv5.URL);
  var id_Channels = UUIDv5(`${ROOT_URL}/channels`,UUIDv5.URL);

  var token = tokenEngine.get(id);
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

/**
 * Create a new link and returns a json to existing chains with link
 * @param {string} id
 * @param {json} options
 * @return {json}
 */

module.exports = function(id, options) {
  var configs = chainConfigs(options);
  var token = createToken(id, configs);
  return token;
};