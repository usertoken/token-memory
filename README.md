memory
=========
[![Coverage Status](https://coveralls.io/repos/github/usertoken/token-memory/badge.svg)](https://coveralls.io/github/usertoken/token-memory)
[![Build Status](https://travis-ci.org/usertoken/token-memory.svg?branch=master)](https://travis-ci.org/usertoken/token-memory)
A small library that provide temporal and durable memory

## Installation

  `npm install --save token-memory`

## Usage

    var Memory = require('token-memory');

    var token = new Memory(config);

    token.put({token: 'aaa111222', name: 'Usertoken Admin'})
    token.get({token: 'aaa111222'});

## Tests

  `npm test`
  `npm run test-cat`

## Contributing

  [CONTRIBUTING](./CONTRIBUTING.md)

## Change Log

  [CHANGELOG](./CHANGELOG.md)
