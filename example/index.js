"use strict";

var tokenID = require("uuid/v1")();
var Token = require("token-memory");

function newToken(id) {
  var token = Token(id);
  var testChain = token.get("TESTCHAIN").get('ID');
  testChain.put(id);
  testChain.val((savedTokenID, indexKey) => {
    console.log( '\n newToken() : ', savedTokenID, '\n KEY : ', indexKey, '\n SAVED : ', id === savedTokenID);
  });
}

newToken(tokenID);
