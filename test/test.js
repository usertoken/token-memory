'use strict';
var Gun = require('gun');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');

var expect = require('chai').expect;
var Chain = require('../index');

var peers = ['troposphere.usertoken.com']
var tokenMemory = Gun({
    peers: peers,
    radisk: false,
    // file: 'radata'
})

////////
describe('#tokenMemory', function() {
    it('should have answer in answerChain', function() {
        // var contractChain = tokenMemory.get(contractID)
        // var answerChain = result.answerChain
        // var contractChain = result.contractChain
        var chainID = 1234567
        var result = Chain(chainID);
        var answerChain = tokenMemory.get(chainID+'/answer')
        answerChain.get('chain').on(function(data, key){
            return expect(data).to.equal(chainID);
        });
    });

    it('should have contractID in contractChain', function() {
        // var answerChain = result.answerChain
        var chainID = 12345678
        var result = Chain(chainID);
        var contractChain = tokenMemory.get(chainID)
        contractChain.get('chain').on(function(data, key){
            return expect(data).to.equal(chainID);
        });
    });
    return
});
////////
