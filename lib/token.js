"use strict";

var UUIDv5 = require('uuid/v5');
var Gun = require("gun/gun");
require("gun/lib/path.js");
require('gun/lib/store');

/**
 * Add a token to global chains
 * @param {string} id
 * @param {json} options
 * @return {[link,{json}]}
 */

var create = function (id, options) {
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

module.exports = { create };
