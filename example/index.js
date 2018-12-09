"use strict";

var Token = require("../");
var options = {id: 'c48c21bba0734a188dcdaf92c1950cd3'}

function newToken() {
  Token(({id, root, token, broadcast, listen}) => {
    token.get('id').once(idFound => {
      if ( id === idFound) {
        broadcast.get('PING').put(id)
        listen.get('PONG').on((peer) => {
          console.log('PEER :', peer, peer === options.id);
        });
      }
    })
  }, options)
}

newToken();
