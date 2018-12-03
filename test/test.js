"use strict";

var expect = require("chai").expect;
var Token = require("../index");

////////
describe("#registerToken", function() {
  it(`should have created token`, function() {
    Token(({token, id}) => {
      return expect(id);
    });
  });
  it(`should have found register token`, function() {
    Token(({token, id}) => {
      token.get('id').once(idFound => {
          // console.log('id: ', id, ' idFound: ', idFound, ' online: ', id === idFound)
          var testChain = token.get("TESTCHAIN").get('id');
          testChain.put(id);
          testChain.once((savedTokenID, indexKey) => {
            // console.log( '\n newToken() : ', savedTokenID, '\n KEY : ', indexKey, '\n SAVED : ', id === savedTokenID);
            return expect(savedTokenID).to.equal(id);
          });
      })
    });
  });
});
////////
