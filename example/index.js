"use strict";

var Token = require("token-memory");

function newToken() {
  Token(({token, id}) => {
    token.get('id').once(idFound => {
        console.log('id: ', id, ' idFound: ', idFound, ' online: ', id === idFound)
        var testChain = token.get("TESTCHAIN").get('id');
        testChain.put(id);
        testChain.once((savedTokenID, indexKey) => {
          console.log( '\n newToken() : ', savedTokenID, '\n KEY : ', indexKey, '\n SAVED : ', id === savedTokenID);
        });
    })
  });
}

newToken();
