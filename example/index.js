"use strict";

var tokenID = require("uuid/v1")();
// var expect = require("chai").expect;
var Token = require("token-memory");

var token = Token(tokenID);
var testChain = token.get("TESTCHAIN");
testChain.put(tokenID);
testChain.once((savedTokenID, indexKey) => {
  console.log(' CHAIN : TESTCHAIN \n', tokenID, ' :saved: ', tokenID === saveTokenID);
  // return expect(savedTokenID).to.equal(tokenID);
});