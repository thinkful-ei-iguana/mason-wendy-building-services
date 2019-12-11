require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");

const ShoppingListService = require("../src/shopping-list-service");

describe("Shopping List Items service object", function () {
  let db;
  let testItems = [
    {
      id: 1,
      name: "soap",
      price: "10.00",
      date_added: new Date("2019-12-11 12:00:00"),
      category: "Snack",
      checked: false
    },
    {
      id: 2,
      name: "cereal",
      price: "1.00",
      date_added: new Date("2019-12-11 12:00:00"),
      category: "Breakfast",
      checked: false
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

  context("Given shopping list has data", () => {
    before(() => {
      return db.insert(testItems)
        .into("shopping_list");
    });

    it("GetAllItem() resolves all items from shopping_list table", () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItems);

      });
    });

    it("insertItem() inserts new item into shopping_list", () => {
      const newItem = {

        name: "soap",
        price: "10.00",
        date_added: new Date("2019-12-11 12:00:00"),
        category: "Snack",

      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            checked: false,
            name: newItem.name,
            price: newItem.price,
            date_added: new Date(newItem.date_added),
            category: newItem.category
          });
        });
    });

  });

});
