"use strict";

var tokenID1 = require("uuid/v1")();
var tokenID2 = require("uuid/v1")();
var expect = require("chai").expect;
var Token = require("../index");

////////
describe("#chainFunctions", function() {
  var savedTokenID1, token1;
  it(`should have create token : ${tokenID1}`, function() {
    var token = Token(tokenID1);
    var testChain = token.get("TESTCHAIN").get('ID');
    testChain.put(tokenID1);
    testChain.val((savedTokenID, indexKey) => {
      savedTokenID1 = savedTokenID;
      // console.log(' CHAIN : ', indexKey, '\n', savedTokenID1, ' :saved: ', tokenID1 === savedTokenID1);
      return expect(savedTokenID1).to.equal(tokenID1);
    });
  });
  it(`should have found created token : ${tokenID1}`, function() {
    token1 = Token(tokenID1);
    var testChain = token1.get("TESTCHAIN").get('ID');
    // testChain.put(tokenID1);
    testChain.val((savedTokenID, indexKey) => {
      // console.log(' CHAIN : ', indexKey, '\n', savedTokenID, ' :saved: ', tokenID1 === savedTokenID);
      return expect(savedTokenID).to.equal(savedTokenID1);
    });
  });
  it(`should find same token from new token: ${tokenID1} <-[TESTCHAIN]-> ${tokenID2}`, function() {
    var token2 = Token(tokenID2);
    var testChain = token2.get("TESTCHAIN").get('ID');
    // testChain.put(tokenID2);
    testChain.val((savedTokenID, indexKey) => {
      // console.log(' CHAIN : ', indexKey, '\n', tokenID1, tokenID2, savedTokenID, ' :saved: ', tokenID1 === savedTokenID);
      return expect(savedTokenID).to.equal(savedTokenID1);
    });
  });
});
////////
