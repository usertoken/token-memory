"use strict";

var UUIDv4 = require('uuid/v4');
var Gun = require('gun/gun');

require('gun/nts');
require('gun/lib/path.js');

var ID = UUIDv4().replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase();
var SEED = ID.toUpperCase();
var ROOT = "ROOT";
var PEERS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var DEV_PEER = ['https://gunjs.herokuapp.com/gun'];

var HUB = "USERTOKEN";

var HUB_CHANNELS_REQUEST = "USERTOKEN/CHANNELS/REQUEST";
var HUB_CHANNELS_RESPONSE = `USERTOKEN/CHANNELS/${SEED}`; // UPPERCASE -> global messages

var ATTRIBUTES = {
  HUB_ATTRIBUTES: "USERTOKEN/ATTRIBUTES",
  HUB_STORAGE: "USERTOKEN/STORAGE",
  HUB_CHANNELS: "USERTOKEN/CHANNELS"
};

var gunOptions = {
  peers: PEERS || DEV_PEER,
  file: false
};

var tokenEngine = Gun(gunOptions);
var token = tokenEngine.get(ID);
var REQUESTS = tokenEngine.get(HUB_CHANNELS_REQUEST);
var RESPONSES = tokenEngine.get(HUB_CHANNELS_RESPONSE);

/**
 * Add a token to global chains
 * @param {function} cb
 */

module.exports = function(cb) {
  tokenEngine.on('out', { get: { '#': { '*': '' } } });

  // create new id chains to listen on
  var id_Attributes = `${ID}/${ATTRIBUTES.HUB_ATTRIBUTES.toLowerCase()}`;
  var id_Storage = `${ID}/${ATTRIBUTES.HUB_STORAGE.toLowerCase()}`;
  var id_Channels = `${ID}/${ATTRIBUTES.HUB_CHANNELS.toLowerCase()}`;
  
  var attributes = tokenEngine.get(id_Attributes);
  var storage = tokenEngine.get(id_Storage);
  var channels = tokenEngine.get(id_Channels);

  // create new links
  var rootLink = tokenEngine.get(ROOT);
  var tokenGenesisLink = tokenEngine.get(HUB);
  var attributesGenesisLink = tokenEngine.get(ATTRIBUTES.HUB_ATTRIBUTES);
  var storageGenesisLink = tokenEngine.get(ATTRIBUTES.HUB_STORAGE);
  var channelsGenesisLink = tokenEngine.get(ATTRIBUTES.HUB_CHANNELS);


  // starts new root
  rootLink.path(ROOT).set(tokenGenesisLink);

  // add new link root
  tokenGenesisLink.path(HUB).set(token); // T0 <- TOKENS[T1, T2, ... Tn] // defines paths to Tn from T0
  tokenGenesisLink.path(ROOT).set(rootLink);
  attributesGenesisLink.path(ATTRIBUTES.HUB_ATTRIBUTES).set(attributes)
  attributesGenesisLink.path(ROOT).set(rootLink);
  storageGenesisLink.path(ATTRIBUTES.HUB_STORAGE).set(storage)
  storageGenesisLink.path(ROOT).set(rootLink);
  channelsGenesisLink.path(ATTRIBUTES.HUB_CHANNELS).set(channels)
  channelsGenesisLink.path(ROOT).set(rootLink);

  // add links to form chains
  attributes.path(ATTRIBUTES.HUB_ATTRIBUTES).set(attributesGenesisLink);
  attributes.path(ROOT).set(rootLink);
  storage.path(ATTRIBUTES.HUB_STORAGE).set(storageGenesisLink);
  storage.path(ROOT).set(rootLink);
  channels.path(ATTRIBUTES.HUB_CHANNELS).set(channelsGenesisLink);
  channels.path(ROOT).set(rootLink);

  // add chains to token
  token.get(ROOT).put(HUB);
  token.get('id').put(ID);
  token.get('seed').put(SEED);
  token.path(ROOT).set(rootLink);
  token.path(HUB).set(tokenGenesisLink); // Tn <- HUB[T0] // defines path to T0 from Tn
  token.path(ATTRIBUTES.HUB_ATTRIBUTES).set(attributesGenesisLink); // Tn <- HUB_ATTRIBUTES[A0]  // defines path to A0
  token.path(ATTRIBUTES.HUB_STORAGE).set(storageGenesisLink); // Tn <- HUB_STORAGE[S0]
  token.path(ATTRIBUTES.HUB_CHANNELS).set(channelsGenesisLink); // Tn <- CHANNELS[C0]

  // Register seed
  REQUESTS.get('REGISTER').put(ID)
  RESPONSES.get('DOORKEY').on(function(doorkey){
    token.get('doorkey').put(doorkey);
    console.log('doorkey :',doorkey);
  });
  return cb({token: token, id: ID});
};
