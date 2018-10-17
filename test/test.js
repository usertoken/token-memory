'use strict';
var Gun = require('gun');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');

var expect = require('chai').expect;
var tokenMemory = require('../index');

var peers = ['troposphere.usertoken.com']
var globalChain = Gun({
    peers: peers,
    radisk: false,
    file: false
})



tokenMemory(1);
////////
describe('#tokenMemory', function() {
    it('should convert single digits and have answer in answerChain', function() {
        // var contractChain = globalChain.get(contractID)
        // var answerChain = result.answerChain
        // var contractChain = result.contractChain

        var answerChain = globalChain.get('1/answer')
        answerChain.get('answer').on(function(data, key){
            expect(data).to.equal('1');
        });
    });

    it('should convert single digits and have contractID in contractChain', function() {
        // var answerChain = result.answerChain

        var contractChain = globalChain.get('1')
        contractChain.get('contractID').on(function(data, key){
            expect(data).to.equal('1');
        });
    });
});
////////
