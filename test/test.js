"use strict";

var expect = require("chai").expect;
var Token = require("../index");

////////
var options = {id: 'c48c21bba0734a188dcdaf92c1950cd3'}

describe("#registerToken", function() {
  it(`should have created token`, function() {
    Token(({id, root, token, broadcast, listen}) => {
      return expect(id);
    });
  });
  it(`should have found token`, function() {
    Token(({id, root, token, broadcast, listen}) => {
      broadcast.get('PING').put(id);
      token.get('id').once(idFound => {
          return expect(options.id).to.equal(id);
      })
    }, options);
  });
});
describe("#pingPongPeers", function() {
  it(`should have ping-pong self`, function() {
    Token(({id, root, token, broadcast, listen}) => {
      broadcast.get('PING').on((id) => {
        listen.get('PONG').put(id);
      });
      listen.get('PONG').on((peer) => {
        // token.path('PEERS').map().once( eachPeer => {
        //   console.log('peers : ', eachPeer)
        // })
        return expect(peer).to.equal(id);
      });
    }, options);
  });
});
////////
