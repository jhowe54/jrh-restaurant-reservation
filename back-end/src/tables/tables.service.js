const knex = require("../db/connection");
const tableName = "tables";


function list() {
    return knex(tableName).select("*")
}



module.exports = {
    list
}