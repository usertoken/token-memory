"use strict";

var UUIDv4 = require('uuid/v4');
var Gun = require('gun/gun');

require('gun/nts');
require('gun/lib/path.js');

var SEEDS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var ID = UUIDv4().replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase();

var ROOT = "/";
var ROOT_ATTRIBUTES = "ROOT/ATTRIBUTES";
var ROOT_CONTRACTS = "ROOT/CONTRACTS";
var ROOT_CHANNELS = "ROOT/CHANNELS";
var GENESIS = 'GENESIS';

/**
 * Create a new token or connect to existing by providing OPTIONS = { id: id, peers: peer || [peers] }
 * @param {function} CB
 * @param {Object} OPTIONS
 */

module.exports = function(CB, OPTIONS) {
  var id = (OPTIONS && OPTIONS.id)? OPTIONS.id : ID;
  var BROADCAST = "BROADCAST";
  var BROADCAST_REPLY = `ROOT/CHANNELS/${id}`;

  var options = {
    peers: (OPTIONS && OPTIONS.peers)? OPTIONS.peers : SEEDS,
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
  var attributesGenesis = tokenEngine.get(ROOT_ATTRIBUTES);
  var contractsGenesis = tokenEngine.get(ROOT_CONTRACTS);
  var channelsGenesis = tokenEngine.get(ROOT_CHANNELS);

  // starts new roots
  root.path(ROOT).set(tokenGenesis);
  root.path('ROOT').set(tokenGenesis);
  root.path(GENESIS).set(tokenGenesis);
  root.path('TOKEN').set(token);
  
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CONTRACTS').set(contractsGenesis);
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CHANNELS').set(channelsGenesis);

  // link to root
  tokenGenesis.path(ROOT).set(root);
  tokenGenesis.path('ROOT').set(root);
  tokenGenesis.path(GENESIS).set(tokenGenesis);
  tokenGenesis.path('TOKEN').set(token);

  tokenGenesis.path('ATTRIBUTES').set(attributesGenesis);
  tokenGenesis.path('CONTRACTS').set(contractsGenesis);
  tokenGenesis.path('ATTRIBUTES').set(attributesGenesis);
  tokenGenesis.path('CHANNELS').set(channelsGenesis);

  attributesGenesis.path(ROOT).set(root);
  attributesGenesis.path('ROOT').set(root);
  attributesGenesis.path(GENESIS).set(tokenGenesis);
  attributesGenesis.path('TOKEN').set(token);

  contractsGenesis.path(ROOT).set(root);
  contractsGenesis.path('ROOT').set(root);
  contractsGenesis.path(GENESIS).set(tokenGenesis);
  contractsGenesis.path('TOKEN').set(token);

  channelsGenesis.path(ROOT).set(root);
  channelsGenesis.path('ROOT').set(root);
  channelsGenesis.path(GENESIS).set(tokenGenesis);
  channelsGenesis.path('TOKEN').set(token);

  // set paths
  token.path(ROOT).set(root);
  token.path('ROOT').set(root)
  token.path(GENESIS).set(tokenGenesis);

  token.path('ATTRIBUTES').set(attributesGenesis);
  token.path('CONTRACTS').set(contractsGenesis);
  token.path('CHANNELS').set(channelsGenesis);

  token.get('BROADCAST').put(BROADCAST);
  token.get('LISTEN').put(BROADCAST_REPLY);
  token.get('ROOT').put(ROOT);
  token.get('id').put(id);

  broadcast.get('PING').put(id)
  broadcast.get('PONG').on((peer) => {
    if (peer === id) return
    token.get('PEERS').put(peer);
  });

  CB({id: id, root: root, token: token, broadcast: broadcast, listen: listen});
};
