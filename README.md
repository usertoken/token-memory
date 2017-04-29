memory
=========

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
