"use strict";

var UUIDv4 = require('uuid/v4');
var Gun = require('gun/gun');

require('gun/nts');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun/lib/store');

var ID = UUIDv4().replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase();
var SEED = ID.toUpperCase();
var ROOT = "ROOT";
var PEERS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var DATA_LOCATION = "tokensdata";

var HUB = "USERTOKEN";
var HUB_ATTRIBUTES = "USERTOKEN/ATTRIBUTES";
var HUB_STORAGE = "USERTOKEN/STORAGE";
var HUB_CHANNELS = "USERTOKEN/CHANNELS";
var HUB_CHANNELS_REQUEST = "USERTOKEN/CHANNELS/REQUEST";
var HUB_CHANNELS_RESPONSE = `USERTOKEN/CHANNELS/${SEED}`; // UPPERCASE -> global messages

var tokenConfigs = {
  HUB,
  ATTRIBUTES: {
    HUB_ATTRIBUTES,
    HUB_STORAGE,
    HUB_CHANNELS
  },
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

module.exports = function(myID) {
  // reserved : '/' '-' UPPERCASE
  var id = myID? myID.replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase() : ID;  // lowercase -> personal messages
  var tokenEngine = Gun(tokenConfigs.ENGINE);
  var REQUESTS = tokenEngine.get(HUB_CHANNELS_REQUEST);
  var RESPONSES = tokenEngine.get(HUB_CHANNELS_RESPONSE);

  // create new id chains to listen on
  var id_Attributes = `${id}/${tokenConfigs.ATTRIBUTES.HUB_ATTRIBUTES.toLowerCase()}`;
  var id_Storage = `${id}/${tokenConfigs.ATTRIBUTES.HUB_STORAGE.toLowerCase()}`;
  var id_Channels = `${id}/${tokenConfigs.ATTRIBUTES.HUB_CHANNELS.toLowerCase()}`;
  
  var token = tokenEngine.get(id);
  var attributes = tokenEngine.get(id_Attributes);
  var storage = tokenEngine.get(id_Storage);
  var channels = tokenEngine.get(id_Channels);

  // create new links
  var rootLink = tokenEngine.get(ROOT);
  var tokenGenesisLink = tokenEngine.get(tokenConfigs.HUB);
  var attributesGenesisLink = tokenEngine.get(tokenConfigs.ATTRIBUTES.HUB_ATTRIBUTES);
  var storageGenesisLink = tokenEngine.get(tokenConfigs.ATTRIBUTES.HUB_STORAGE);
  var channelsGenesisLink = tokenEngine.get(tokenConfigs.ATTRIBUTES.HUB_CHANNELS);


  // starts new root
  rootLink.path(ROOT).set(tokenGenesisLink)

  // add new link root
  tokenGenesisLink.path(tokenConfigs.HUB).set(token); // T0 <- TOKENS[T1, T2, ... Tn] // defines paths to Tn from T0
  tokenGenesisLink.path(ROOT).set(rootLink)
  attributesGenesisLink.path(tokenConfigs.ATTRIBUTES.HUB_ATTRIBUTES).set(attributes)
  attributesGenesisLink.path(ROOT).set(rootLink)
  storageGenesisLink.path(tokenConfigs.ATTRIBUTES.HUB_STORAGE).set(storage)
  storageGenesisLink.path(ROOT).set(rootLink)
  channelsGenesisLink.path(tokenConfigs.ATTRIBUTES.HUB_CHANNELS).set(channels)
  channelsGenesisLink.path(ROOT).set(rootLink)

  // add links to form chains
  attributes.path(tokenConfigs.ATTRIBUTES.HUB_ATTRIBUTES).set(attributesGenesisLink);
  attributes.path(ROOT).set(rootLink)
  storage.path(tokenConfigs.ATTRIBUTES.HUB_STORAGE).set(storageGenesisLink);
  storage.path(ROOT).set(rootLink)
  channels.path(tokenConfigs.ATTRIBUTES.HUB_CHANNELS).set(channelsGenesisLink);
  channels.path(ROOT).set(rootLink)

  // add chains to token
  token.get(ROOT).put(tokenConfigs.HUB)
  token.path(ROOT).set(rootLink)
  token.path(tokenConfigs.HUB).set(tokenGenesisLink); // Tn <- HUB[T0] // defines path to T0 from Tn
  token.path(tokenConfigs.ATTRIBUTES.HUB_ATTRIBUTES).set(attributesGenesisLink); // Tn <- HUB_ATTRIBUTES[A0]  // defines path to A0
  token.path(tokenConfigs.ATTRIBUTES.HUB_STORAGE).set(storageGenesisLink); // Tn <- HUB_STORAGE[S0]
  token.path(tokenConfigs.ATTRIBUTES.HUB_CHANNELS).set(channelsGenesisLink); // Tn <- CHANNELS[C0]

  // Register seed
  REQUESTS.get('REGISTER').put(SEED)
  RESPONSES.get('DOORKEY').on(function(doorkey){
    token.get('doorkey').put(doorkey);
    console.log('doorkey :',doorkey);
  })

  return token;
};
