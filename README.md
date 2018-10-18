token-memory
[![Coveralls Status](https://coveralls.io/repos/github/usertoken/token-memory/badge.svg)](https://coveralls.io/github/usertoken/token-memory)
[![Travis Status](https://travis-ci.org/usertoken/token-memory.svg)](https://travis-ci.org/usertoken/token-memory)
[![Coverity Status](https://scan.coverity.com/projects/16405/badge.svg)](https://scan.coverity.com/projects/token-memory)
=========

A small library that provide temporal and durable memory

## Installation

  `npm install --save token-memory`

## Usage

    "use strict";

    var UUIDv1 = require("uuid/v1")();
    var Token = require("token-memory");

    var chains = Token(UUIDv1);
    var { chain } = chains;
    var testChain = chain.get("tests");
    testChain.put(chain);
    testChain.once((data, key) => {
      return data === UUIDv1;
    });


## Tests

  `npm test`
  `npm run test-cat`

## Publish

  `npm login`   # [usertoken](https://www.npmjs.com/~usertoken) npm account
  `npm publish` # [token-memory](https://www.npmjs.com/package/token-memory) package

## Contributing

  [CONTRIBUTING](./CONTRIBUTING.md)

## Change Log

  [CHANGELOG](./CHANGELOG.md)

## References

  [build NPM module](https://medium.com/@jdaudier/how-to-create-and-publish-your-first-node-js-module-444e7585b738)
