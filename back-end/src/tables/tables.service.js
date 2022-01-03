
const knex = require("../db/connection");
const tablesName = "tables";

async function create(newTable) {
    return await knex(tablesName).insert(newTable).returning("*").then((createdRecords) => createdRecords[0])
}
function list() {
    return knex(tablesName).select("*").orderBy("table_name", "asc")
}

  function update(updatedTable) {
    return knex(tablesName)
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0])
}

function read(table_id) {
    return knex(tablesName).select("*").where({table_id}).first()
}

function getReservation(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()
}


module.exports = {
    create,
    list,
    update,
    read,
    getReservation,
   
}