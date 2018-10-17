'use strict';
var Gun = require('gun');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');

var peers = ['troposphere.usertoken.com']
var tokenMemory = Gun({
    peers: peers,
    radisk: false,
    // file: 'radata'
})

/**
 * Blockchain Contract for CRUD on memories
 * @param {string} chain
 * @param {string} locale
 * @return {string}
 */

module.exports = function(chain, locale) {
    var contractChain = tokenMemory.get(chain)
    var answerChain = tokenMemory.get(chain+'/answer')
    // var answer = chain.toLocaleString(locale)
    //
    contractChain.get('chain').put(chain)
    answerChain.get('chain').put(chain)
    // contractChain.path('answer').set(answerChain)
    var answer = {contractChain: contractChain, answerChain: answerChain};
    return answer
};