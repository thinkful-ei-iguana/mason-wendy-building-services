require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");

const ShoppingListService = require("../src/shopping-list-service");

describe(`Shopping List Items service object`, function() {
  let db;
  let testItems = [
    {
      name: "soap",
      price: 10.0,
      date_added: new Date("2019-12-11 12:00:00"),
      category: "snack"
    },
    {
      name: "cereal",
      price: 1.0,
      date_added: new Date("2019-12-11 12:00:00"),
      category: "breakfast"
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db("shopping_list").truncate());

  after(() => db.destroy());

  afterEach(() => db("shopping_list").truncate());

  context("Given shopping list with no data, returns empty array", () => {
    it("getAllItems() resolves an empty array", () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
  });
});
