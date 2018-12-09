"use strict";

var UUIDv4 = require('uuid/v4');
var Gun = require('gun/gun');

require('gun/nts');
require('gun/lib/path.js');

var PEERS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];

var ROOT = "/";
var BROADCAST = "BROADCAST";

var GENESIS = "USERTOKEN";
var GENESIS_ATTRIBUTES = "USERTOKEN/ATTRIBUTES";
var GENESIS_CONTRACTS = "USERTOKEN/CONTRACTS";
var GENESIS_CHANNELS = "USERTOKEN/CHANNELS";


/**
 * Create a new token or connect to existing by providing OPTIONS = { id: id, peers: peer || [peers] }
 * @param {function} CB
 * @param {Object} OPTIONS
 */

module.exports = function(CB, OPTIONS) {

  var id = (OPTIONS && OPTIONS.id)? OPTIONS.id : UUIDv4().replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase();
  var BROADCAST_REPLY = `USERTOKEN/CHANNELS/${id}`;

  var options = {
    peers: (OPTIONS && OPTIONS.peers)? OPTIONS.peers : PEERS,
    file: false
  };
  
  var tokenEngine = Gun(options);
  tokenEngine.on('out', { get: { '#': { '*': '' } } });

  var broadcast = tokenEngine.get(BROADCAST);
  var listen = tokenEngine.get(BROADCAST_REPLY);

  // get genesis roots
  var root = tokenEngine.get(ROOT);
  var token = tokenEngine.get(id);

  var tokenGenesis = tokenEngine.get(GENESIS);
  var attributesGenesis = tokenEngine.get(GENESIS_ATTRIBUTES);
  var contractsGenesis = tokenEngine.get(GENESIS_CONTRACTS);
  var channelsGenesis = tokenEngine.get(GENESIS_CHANNELS);

  // starts new roots
  root.path(ROOT).set(tokenGenesis);
  root.path('ROOT').set(tokenGenesis);
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CONTRACTS').set(contractsGenesis);
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CHANNELS').set(channelsGenesis);
  root.path('TOKEN').set(token);

  // link to root
  tokenGenesis.path(ROOT).set(root);
  tokenGenesis.path('ROOT').set(root);
  tokenGenesis.path('ATTRIBUTES').set(attributesGenesis);
  tokenGenesis.path('CONTRACTS').set(contractsGenesis);
  tokenGenesis.path('ATTRIBUTES').set(attributesGenesis);
  tokenGenesis.path('CHANNELS').set(channelsGenesis);
  tokenGenesis.path('TOKEN').set(token);

  attributesGenesis.path(ROOT).set(root);
  attributesGenesis.path('ROOT').set(root);
  attributesGenesis.path('TOKEN').set(token);

  contractsGenesis.path(ROOT).set(root);
  contractsGenesis.path('ROOT').set(root);
  contractsGenesis.path('TOKEN').set(token);

  channelsGenesis.path(ROOT).set(root);
  channelsGenesis.path('ROOT').set(root);
  channelsGenesis.path('TOKEN').set(token);

  token.get('ROOT').put(ROOT);
  token.get('id').put(id);

  // set paths
  token.path(ROOT).set(root);
  token.path('ROOT').set(root)
  token.path('GENESIS').set(tokenGenesis);
  token.path('ATTRIBUTES').set(attributesGenesis);
  token.path('CONTRACTS').set(contractsGenesis);
  token.path('CHANNELS').set(channelsGenesis);

  CB({id: id, root: root, token: token, broadcast: broadcast, listen: listen});
};
