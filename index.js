"use strict";

var Random = require('random-js');
var siphash24 = require('siphash24');
var SafeBuffer = require('safe-buffer');
var UUIDv5 = require('uuid/v5');
var Gun = require('gun/gun');

require('gun/nts');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun/lib/store');


var requestCounter, siphash24Input, entropy;
var array = [];
var ID = UUIDv5();
const randomSeed = ID.replace(/\-/g, '');
var Buffer = SafeBuffer.Buffer;
var ROOT_SEED = "troposphere.usertoken.com";
var PEERS = [ROOT_SEED];
var DEFAULT_URL = `https://${ROOT_SEED}/tokens`;
var DATA_LOCATION = "tokensdata";

var TOKEN_CHAIN = "USERTOKEN";
var ATTRIBUTES_CHAIN = "ATTRIBUTES";
var STORAGE_CHAIN = "STORAGE";
var CHANNELS_CHAIN = "CHANNELS";
var CHANNELS_AMOUNT = "CHANNELS/AMOUNT";
var CHANNELS_REGISTRATION = "CHANNELS/REGISTRATION";

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

module.exports = function(myID, configs) {
  var options = configs? configs : tokenConfigs;
  var id = myID? myID : ID;
  var tokenEngine = Gun(options.ENGINE);

  // create new chains
  var ROOT_URL = `${DEFAULT_URL}/${id.toLowerCase()}`;
  var id_Attributes = UUIDv5(`${ROOT_URL}/${ATTRIBUTES_CHAIN.toLowerCase()}`,UUIDv5.URL);
  var id_Storage = UUIDv5(`${ROOT_URL}/${STORAGE_CHAIN.toLowerCase()}`,UUIDv5.URL);
  var id_Channels = UUIDv5(`${ROOT_URL}/${CHANNELS_CHAIN.toLowerCase()}`,UUIDv5.URL);

  var AMOUNT = UUIDv5(`${ROOT_URL}/${CHANNELS_AMOUNT.toLowerCase()}`,UUIDv5.URL);
  var REGISTRATION = UUIDv5(`${ROOT_URL}/${CHANNELS_REGISTRATION.toLowerCase()}`,UUIDv5.URL);

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

  // registration
  AMOUNT.get('entropy').once((e,label) => {
    if (e) { entropy = e}
      else {
      entropy = siphash24(
        Buffer.from(requestCounter),
        Buffer.from(ID),
      ).toString(16)
    }
  })
  AMOUNT.get('members').once((total,label) => {
    requestCounter = total? total : ++requestCounter;
    siphash24Input = [ requestCounter, entropy, ];
    entropy = siphash24(
      Buffer.from(siphash24Input),
      Buffer.from(ID),
    ).toString(16);
  })

  AMOUNT.get('entropy').put(entropy)
  if (requestCounter) AMOUNT.get('members').put(requestCounter)
  return token;
};
