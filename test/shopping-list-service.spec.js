require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");

const ShoppingListService = require("../src/shopping-list-service");

describe(`Articles service object`, function() {
  it(`should run the tests`, () => {
    expect(true).to.eql(false);
  });
});
