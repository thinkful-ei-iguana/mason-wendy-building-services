require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");

const ShoppingListService = require("../src/shopping-list-service");

describe("Shopping List Items service object", function() {
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
    beforeEach(() => {
      return db.insert(testItems).into("shopping_list");
    });

    it("GetAllItem() resolves all items from shopping_list table", () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItems);
      });
    });

    it("getById() resolves an article by id from 'shopping_list'", () => {
      const secondId = 2;
      const secondTestItem = testItems[secondId - 1];
      return ShoppingListService.getById(db, secondId).then(actual => {
        expect(actual).to.eql({
          id: secondId,
          name: secondTestItem.name,
          price: secondTestItem.price,
          date_added: secondTestItem.date_added,
          category: secondTestItem.category,
          checked: secondTestItem.checked
        });
      });
    });

    it("updateItem() updates an item in the shopping list table", () => {
      const idOfItemToUpdate = 2;
      const updatedItem = {
        name: "toothpaste",
        category: "Breakfast",
        checked: true,
        date_added: new Date("2019-12-11 12:00:00"),
        price: "5.00"
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, updatedItem)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...updatedItem
          });
        });
    });

    it("deleteItem() removes an item from the shopping list table", () => {
      const idToDelete = 2;
      return ShoppingListService.deleteItem(db, idToDelete)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== idToDelete);
          expect(allItems).to.eql(expected);
        });
    });
  });

  it("insertItem() inserts new item into shopping_list with id", () => {
    const newItem = {
      name: "soap",
      price: "10.00",
      date_added: new Date("2019-12-11 12:00:00"),
      category: "Snack"
    };
    return ShoppingListService.insertItem(db, newItem).then(actual => {
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
