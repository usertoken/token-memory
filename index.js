"use strict";

var Timer = require('marky');
var UUIDv4 = require('uuid/v4');
var Gun = require('gun/gun');
require('gun/nts');
require('gun/lib/path.js');

var SEEDS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var ID = UUIDv4().replace(/\//g, '').replace(/\-/g, '').replace(/\ /g, '').toLowerCase();

var ROOT = "USERTOKEN";
var ROOT_ATTRIBUTES = "USERTOKEN/ATTRIBUTES";
var ROOT_CONTRACTS = "USERTOKEN/CONTRACTS";
var ROOT_CHANNELS = "USERTOKEN/CHANNELS";


var tokenPeers = [];

/**
 * Create a new token or connect to existing by providing OPTIONS = { id: id, peers: peer || [peers] }
 * @param {function} CB
 * @param {Object} OPTIONS
 */

module.exports = function(CB, OPTIONS) {
  var id = (OPTIONS && OPTIONS.id)? OPTIONS.id : ID;
  var BROADCAST = "BROADCAST";
  var BROADCAST_REPLY = `${ROOT}/CHANNELS/${id}`;

  var TOKEN_ATTRIBUTES = `${id}/attributes`;
  var TOKEN_CONTRACTS = `${id}/contracts`;
  var TOKEN_CHANNELS = `${id}/channels`;

  var options = {
    peers: (OPTIONS && OPTIONS.peers)? OPTIONS.peers : SEEDS,
    file: false
  };

  var genesis = Gun(options);
  genesis.on('out', { get: { '#': { '*': '' } } });

  // set up communication rootChannels
  var broadcast = genesis.get(BROADCAST);
  var listen = genesis.get(BROADCAST_REPLY);

  // genesis token
  var token = genesis.get(id);
  var attributes = genesis.get(TOKEN_ATTRIBUTES);
  var contracts = genesis.get(TOKEN_CONTRACTS);
  var channels = genesis.get(TOKEN_CHANNELS);

  // genesis root
  var root = genesis.get(ROOT);
  var rootAttributes = genesis.get(ROOT_ATTRIBUTES);
  var rootContracts = genesis.get(ROOT_CONTRACTS);
  var rootChannels = genesis.get(ROOT_CHANNELS);

  // root paths
  root.path('TOKENS').set(token);
  root.path('ATTRIBUTES').set(rootAttributes);
  root.path('CONTRACTS').set(rootContracts);
  root.path('CHANNELS').set(rootChannels);

  // set paths
  token.path('ROOT').set(root);

  token.path('ATTRIBUTES').set(attributes);
  token.path('CONTRACTS').set(contracts);
  token.path('CHANNELS').set(channels);

  token.get('id').put(id);
  token.get('ID').put(id);

  token.get('BROADCAST').put(BROADCAST);
  token.get('LISTEN').put(BROADCAST_REPLY);

  token.get('ROOT').put(ROOT);
  token.get('ATTRIBUTES').put(TOKEN_ATTRIBUTES);
  token.get('CONTRACTS').put(TOKEN_CONTRACTS);
  token.get('CHANNELS').put(TOKEN_CHANNELS);

  token.get('PEERS').once((peer) => {
    if (!peer) return
    Timer.mark(id);
    var newPeer = genesis.get(peer);
    if (tokenPeers.indexOf(peer) === -1) {
      broadcast.get('PING').put(id);
      broadcast.get('PONG').on((peer) => {
        if (peer === id || tokenPeers.indexOf(peer) === -1) return;
        token.path('PEERS').set(newpeer);
        token.get('PEERS').put(peer);
        tokenPeers.push(peer);
      });
      var stats = Timer.stop(id);
      newPeer.get('STATS').put(JSON.stringify(stats));
    };
  });
  CB({id: id, token: token, genesis: genesis, broadcast: broadcast, listen: listen});
};