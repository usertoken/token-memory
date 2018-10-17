'use strict';
var Gun = require('gun');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');

var peers = ['troposphere.usertoken.com']

/**
 * Blockchain Contract for CRUD on memories
 * @param {number} contractID
 * @param {string} locale
 * @return {string}
 */

module.exports = function(contractID, locale) {
    var globalChain = Gun({
        peers: peers,
        radisk: false,
        file: false
    })
    var contractChain = globalChain.get(contractID)
    var answerChain = globalChain.get(contractID+'/answer')
    var answer = contractID.toLocaleString(locale)
    //
    contractChain.put({contractID: contractID})
    answerChain.put({answer: answer})
    // contractChain.path('answer').set(answerChain)
    return {contractChain: contractChain, answerChain: answerChain};
};