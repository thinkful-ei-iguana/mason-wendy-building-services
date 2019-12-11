const ShoppingListService = {
  getAllItems(knex) {
    return knex.select("*").from("shopping_list");
  },

  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into("shopping_list")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },



};

module.exports = ShoppingListService;
