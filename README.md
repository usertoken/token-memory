token-memory
[![Coveralls Status](https://coveralls.io/repos/github/usertoken/token-memory/badge.svg)](https://coveralls.io/github/usertoken/token-memory)
[![Travis Status](https://travis-ci.org/usertoken/token-memory.svg)](https://travis-ci.org/usertoken/token-memory)
[![Coverity Status](https://scan.coverity.com/projects/16405/badge.svg)](https://scan.coverity.com/projects/token-memory)
=========

A small library that provides durable memories

## Installation

  `npm install --save token-memory`

## Usage [Example](example)

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


## Tests

  `npm test`

## Publish

  `npm login`   # [usertoken](https://www.npmjs.com/~usertoken) npm account

  `npm publish` # [token-memory](https://www.npmjs.com/package/token-memory) package

## Contributing

  [CONTRIBUTING](./CONTRIBUTING.md)

## Change Log

  [CHANGELOG](./CHANGELOG.md)

## References

  [build NPM module](https://medium.com/@jdaudier/how-to-create-and-publish-your-first-node-js-module-444e7585b738)
