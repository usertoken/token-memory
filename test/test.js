"use strict";

var UUIDv1 = require("uuid/v1")();
var expect = require("chai").expect;
var Token = require("../index");

////////
describe("#chainFunctions", () => {
  it(`should have create new chain : ${UUIDv1}`, () => {
    var chains = Token(UUIDv1);
    var { chain } = chains;
    var testChain = chain.get("tests");
    testChain.put(chain);
    testChain.once((data, key) => {
      return expect(data).to.equal(UUIDv1);
    });
  });
});
////////
